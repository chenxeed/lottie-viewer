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
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  CreateAssetMutation,
  CreateAssetMutationVariables,
  Exact,
  Mutation,
} from "../../../repo/server-graphql/__generated__/graphql";
import {
  FeaturedPublicAnimationsQuery,
  FeaturedPublicAnimationsQueryVariables,
  InputMaybe,
  Query as LottieQuery,
} from "../../../repo/lottie-graphql/__generated__/graphql";

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

type Mocks = [
  {
    request: {
      query: TypedDocumentNode<
        CreateAssetMutation,
        Exact<{ userId: number; title: string; file: string; criteria: string }>
      >;
      variables: CreateAssetMutationVariables;
    };
    result: {
      data: {
        createAsset: Mutation["createAsset"];
      };
    };
  },
  {
    request: {
      query: TypedDocumentNode<
        FeaturedPublicAnimationsQuery,
        Exact<{
          after?: InputMaybe<string> | undefined;
        }>
      >;
      variables: FeaturedPublicAnimationsQueryVariables;
    };
    result: {
      data: {
        featuredPublicAnimations: LottieQuery["featuredPublicAnimations"];
      };
    };
  },
];

const mocks: Mocks = [
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
            assets: [],
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
                commentsCount: 0,
                createdAt: "2021-07-07T09:00:00.000Z",
                createdByUserId: "1",
                isLiked: false,
                likesCount: 0,
              },
              cursor: "abc123",
            },
          ],
          pageInfo: {
            endCursor: "def456",
            hasNextPage: false,
            hasPreviousPage: false,
          },
          totalCount: 1,
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
