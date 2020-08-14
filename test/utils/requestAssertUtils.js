const axios = require('axios');

const assertUtils = {
    assertHTTPRequestRequirement: (requirement) => {
        const requestOptions = expect.objectContaining(requirement);
        expect(axios).toHaveBeenCalledWith(requestOptions);
    },

    assertHTTPRequestRequirements: (requirements) => {
        for (const { name, requirement } of requirements) {
            it(name, () => {
                assertUtils.assertHTTPRequestRequirement(requirement);
            });
        }
    }
};

module.exports = assertUtils;  