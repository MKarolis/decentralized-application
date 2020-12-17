import './App.css';
import React, {Component, useEffect, useState} from 'react';
import Web3 from "web3";
import Application from '../../abis/Application.json';
import CreateFundraiser from "../CreateFundraiser/CreateFundraiser";
import LoadingOverlay from 'react-loading-overlay';
import {FadeLoader} from "react-spinners";
import FundraiserList from "../FundraisersList/FundraiserList";
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import {mapToFundraisers} from "../../commons/utils/utils";
import ErrorPage from "../ErrorPage/ErrorPage";

// TODO: Show unsupported page if no ethereum found

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [fundraisers, setFundraisers] = useState([]);
    const [error, setError] = useState(false);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            window.ethereum.on('accountsChanged', async () => {
                const acc = await window.web3.eth.getAccounts();
                setAccount(acc[0]);
            })
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            setError(true);
        }
    };

    const connectToNetwork = async () => {
        const web3 = window.web3;
        if (!web3) return;

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = Application.networks[networkId];

        if (networkData) {
            const application = new web3.eth.Contract(Application.abi, networkData.address);
            application.handleRevert = true;

            application.events.FundraiserCreated(onFundraiserCreated);
            application.events.FundraiserFundsChanged(onFundraiserFundsChanged);
            application.events.FundraiserStateChanged(onFundraiserStateChanged);

            setContract(application);

            const allFundraisers = await application.methods.getAllFundraisers().call();

            setFundraisers(mapToFundraisers(allFundraisers));
            setIsLoading(false);
        } else {
            setError(true);
        }
    };

    const onFundraiserCreated = (error, data) => {
        if (error) return;
        const { returnValues } = data;
        const newFundraiser = {
            id: returnValues.id,
            title: returnValues.title,
            goal: returnValues.goal,
            owner: returnValues.owner,
            raised: '0',
            state: 0,
        };
        console.log(data);
        setFundraisers(fundraisers => [...fundraisers, newFundraiser]);
    };

    const onFundraiserFundsChanged = (error, data) => {
        if (error) return;
        const { returnValues: { id, raised } } = data;
        const updatedFundraisersFn = (raisers) => raisers.map(
            fundraiser => fundraiser.id === id ? {...fundraiser, raised: raised} : fundraiser
        );
        setFundraisers(updatedFundraisersFn);
    };

    const onFundraiserStateChanged = (error, data) => {
        if (error) return;
        const { returnValues: { id, state } } = data;
        const updatedFundraisersFn = (raisers) => raisers.map(
            fundraiser => fundraiser.id === id ? {...fundraiser, state: state} : fundraiser
        );
        setFundraisers(updatedFundraisersFn);
    };

    useEffect( () => {
        loadWeb3();
        connectToNetwork();
    },[]);

    return (
        error ? <ErrorPage/> :
        <>
            <LoadingOverlay className='loading-overlay-root' active={isLoading} spinner={<FadeLoader color='#FFF'/>}>
                <div className='app-container'>
                    <h1 className='center-header'>Ethereum Fundraiser</h1>
                    <CreateFundraiser account={account} contract={contract} />
                    <FundraiserList account={account} contract={contract} fundraisers={fundraisers}/>
                </div>
            </LoadingOverlay>
            <ToastsContainer position={ToastsContainerPosition.TOP_CENTER} store={ToastsStore}/>
        </>
    );
};

export default App;
