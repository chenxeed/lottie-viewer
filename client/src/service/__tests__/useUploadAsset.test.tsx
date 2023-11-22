import { useUploadAsset } from "../useUploadAsset";
import { act, renderHook } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { CREATE_ASSET } from "../../repo/server-graphql/graph";
import { Criteria } from "../../store/types";

jest.mock("../fileBucket", () => ({
  uploadFileToBucket: () =>
    new Promise((res) => res({ filename: "12345-file", originalname: "file" })),
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
];

describe("useUploadAsset", () => {
  test("can run upload when user is sync", async () => {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUploadAsset(), { wrapper });

    const uploadAsset = result.current;

    const file = new File([""], "filename", { type: "image/png" });

    await act(async () => {
      const uploadResult = await uploadAsset(file, Criteria.GAME, {
        id: 1,
        name: "username",
        isSync: true,
      });
      expect(uploadResult.data).toEqual({
        ...mocks[0].result.data.createAsset,
        user: mocks[0].result.data.createAsset.user.name,
      });
    });
  });

  test("fail to run upload when user is not sync", async () => {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUploadAsset(), { wrapper });

    const uploadAsset = result.current;

    const file = new File([""], "filename", { type: "image/png" });

    await act(async () => {
      const uploadResult = await uploadAsset(file, Criteria.GAME, {
        id: 1,
        name: "username",
        isSync: false,
      });
      expect(uploadResult.data).toEqual(null);
      expect((uploadResult.error as Error).message).toContain(
        "User has not synced yet",
      );
    });
  });
});
