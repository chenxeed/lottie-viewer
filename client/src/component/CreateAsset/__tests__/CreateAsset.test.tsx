import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
  cleanup,
} from "@testing-library/react";
import { CreateAsset } from "../";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { CREATE_ASSET } from "../../../repo/server-graphql/graph";
import { Criteria } from "../../../store/types";

jest.mock("@dotlottie/react-player", () => ({
  DotLottiePlayer: () => <div>DotLottiePlayer</div>,
  Controls: () => <div>DotLottieControls</div>,
}));

URL.createObjectURL = () => "12345";

const mocks = [
  {
    request: {
      query: CREATE_ASSET,
      variables: {
        userId: 1,
        title: "file",
        file: "12345-file",
        criteria: Criteria.GAME,
      },
    },
    result: {
      data: {
        createAsset: {
          id: 1,
          file: "12345-file",
          criteria: "criteria",
          title: "file",
          user: {
            id: 1,
            name: "user",
          },
          createdAt: "createdAt",
        },
      },
    },
  },
];

jest.mock("../../../helper/fileUpload", () => {
  const { createMockFileList } = require("../../../tests/mockFileList");
  const bouncyBall = require("../../../asset/bouncy-ball.json");
  return {
    uploadFile: () =>
      new Promise((res) => {
        const fileList = createMockFileList([
          {
            name: "bouncy-ball.json",
            body: JSON.stringify(bouncyBall),
            mimeType: "application/json",
          },
        ]);
        res(fileList);
      }),
  };
});

afterEach(cleanup);

describe("CreateAsset", () => {
  test("submit uploaded JSON data", async () => {
    // Arrange
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    render(<CreateAsset />, { wrapper });

    // Act

    userEvent.click(screen.getByText("Choose a File"));

    await waitFor(() => screen.findByText("Preview your animation"));

    userEvent.click(screen.getByText("Submit!"));

    await waitForElementToBeRemoved(() => screen.queryByText("Submit!"));

    // Assert

    await waitFor(() => {
      expect(screen.queryByText("Submit")).toBeNull();
    });
  });
});
