import './App.css';
import React, {Component} from 'react';
import Web3 from "web3";
import Application from '../../abis/Application.json';
import CreateFundraiser from "../CreateFundraiser/CreateFundraiser";
import LoadingOverlay from 'react-loading-overlay';
import {FadeLoader} from "react-spinners";

// TODO: Show unsupported page if no ethereum found

class App2 extends Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.loadWeb3();
        this.connectToNetwork();
    }

    loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('No ethereum provider found!')
        }
    };

    connectToNetwork = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);

        this.setState({account: accounts[0]});

        const networkId = await web3.eth.net.getId();
        const networkData = Application.networks[networkId];

        if (networkData) {
            const application = new web3.eth.Contract(Application.abi, networkData.address);

            application.once('FundraiserCreated', (e, data) => console.log("FundraiserCreated EVENTY: ", data, e));

            this.setState({application});
            const fundraiserCount = await application.methods.fundraiserCount().call();
            console.log("FUNDRAISER COUNT", fundraiserCount);
        } else {
           window.alert("Application not deployed on selected network!")
        }
    };

    getAllFundraisers = () => {
        const { application } = this.state;
        application.methods.getAllFundraisers().call().then((value => console.log(value)))
    };

    createAFundraiser = async () => {
        const { application, account } = this.state;
        // const results = await application.methods.createFundraiser('TITLE 2', 0).call();
        // console.log(results);
        application.methods.createFundraiser('TITLE 2', 100).send({from: account}, (val, e) => console.log('CALLBACK',e, val))
            .then(console.log)
            .catch(console.log);
    }

    render() {
        return (
            <div className="App">
              <header className="App-header">
                <p>
                  Edit <code>src/App.js</code> and save to relodeiu
                </p>
                  <button onClick={() => this.getAllFundraisers()}>
                      CLICK TO GET ALL FUNDRAISERS
                  </button>
                  <button onClick={() => this.createAFundraiser()}>
                      CLICK TO CREATE A FUNDRAISER
                  </button>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
        );
    }
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    render() {
        return (
            <LoadingOverlay className='loading-overlay-root' active={this.state.isLoading} spinner={<FadeLoader color='#FFF'/>}>
                <div className='app-container'>
                    <h1 className='center-header'>Ethereum Fundraiser</h1>
                    <CreateFundraiser/>
                </div>
            </LoadingOverlay>
        );
    }
}

export default App;
