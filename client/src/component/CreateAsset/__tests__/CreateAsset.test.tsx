import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  cleanup,
} from "@testing-library/react";
import { CreateAsset } from "../";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { CREATE_ASSET } from "../../../repo/server-graphql/graph";
import { Criteria } from "../../../store/types";
import { FEATURED_PUBLIC_ANIMATIONS } from "../../../repo/lottie-graphql/graph";

// Mock the libraries used in this component

jest.mock("@dotlottie/react-player", () => {
  const { forwardRef } = require("react");
  return {
    DotLottiePlayer: forwardRef((_: any, ref: any) => (
      <div ref={ref}>DotLottiePlayer</div>
    )),
    Controls: () => <div>DotLottieControls</div>,
  };
});

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

jest.mock("../../../service/fileBucket", () => ({
  fetchFileFromPublicURL: () =>
    new Promise((res) =>
      res({
        name: "filename",
        type: "application/json",
        size: 0,
        lastModified: new Date().getTime(),
      }),
    ),
}));

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
  {
    request: {
      query: FEATURED_PUBLIC_ANIMATIONS,
      variables: {},
    },
    result: {
      data: {
        featuredPublicAnimations: {
          edges: [
            {
              node: {
                id: 1025449,
                slug: "lottie-node",
                lottieUrl:
                  "https://assets-v2.lottiefiles.com/a/327ab14e-64a4-11ee-a4e0-db1e90efd329/LNhtKhpo3I.lottie",
                name: "Lottie Node",
              },
            },
          ],
          pageInfo: {
            endCursor: "def456",
            hasNextPage: false,
          },
        },
      },
    },
  },
];

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

  test("submit from lottie animation data", async () => {
    // Arrange
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    render(<CreateAsset />, { wrapper });

    // Act

    userEvent.click(screen.getByText("Find a Lottie"));

    await waitFor(() =>
      screen.findByText("Get the best from LottieFiles Featured Animation"),
    );

    userEvent.click(screen.getByText("Lottie Node"));

    await waitFor(() => screen.findByText("Preview your animation"));

    userEvent.click(screen.getByText("Submit!"));

    await waitForElementToBeRemoved(() => screen.queryByText("Submit!"));

    // Assert

    await waitFor(() => {
      expect(screen.queryByText("Submit")).toBeNull();
    });
  });
});
