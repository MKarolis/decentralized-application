
export const mapToFundraisers = (response) => {
    const fundraisers = [];
    const fundraiserCount = response['0'].length;

    for (let i = 0; i < fundraiserCount; i++) {
        fundraisers.push({
            id: response['0'][i],
            owner: response['1'][i],
            title: response['2'][i],
            goal: response['3'][i],
            raised: response['4'][i],
            state: response['5'][i],
        });
    }

    return fundraisers;
};