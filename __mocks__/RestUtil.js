export const mockGetProjectHeader = jest.fn();
const mockRestUtil = jest.fn().mockImplementation(() => {
  return { getProjectHeader: mockGetProjectHeader };
});

export default mockRestUtil;
