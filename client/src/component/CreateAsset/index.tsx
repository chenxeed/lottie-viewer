import { ChangeEvent, useEffect, useState } from "react";
import { uploadFile } from "../../helper/fileUpload";
import { useUploadAsset } from "../../service/useUploadAsset";
import clsx from "clsx";
import { Criteria } from "../../store/types";
import { useSyncAssets } from "../../service/useSyncAssets";
import { Button } from "../../atoms/Button";
import { useSyncUser } from "../../service/useSyncUser";
import { useStateSetNotification } from "../../store/notification";
import { Preview } from "./Preview";
import { Curated } from "./Curated";
import { fetchFileFromPublicURL } from "../../service/fileBucket";
import { useStateCriteria } from "../../store/assets";
import { Modal } from "../../atoms/Modal";
import { Select } from "../../atoms/Select";

const criteriaOption = [
  Criteria.GAME,
  Criteria.NATURE,
  Criteria.PEOPLE,
  Criteria.SCIENCE,
  Criteria.SHAPE,
  Criteria.TECH,
].map((criteria) => ({ label: criteria, value: criteria }));

export const CreateAsset = () => {
  // Shared state
  const criteria = useStateCriteria();
  const setNotification = useStateSetNotification();

  // Local values

  const [openModal, setOpenModal] = useState(false);
  const [showCurated, setShowCurated] = useState(false);
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [lottieSource, setLottieSource] = useState<string | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>(
    Criteria.SHAPE,
  );
  const [loadingLottie, setLoadingLottie] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Service hooks

  const syncUser = useSyncUser();
  const uploadAsset = useUploadAsset({ fallback: true });
  const syncAssets = useSyncAssets();

  // Event Listeners

  const onClickCurate = () => {
    setLottieSource(null);
    setShowCurated(true);
  };

  const onClickBack = () => {
    setShowCurated(false);
    setLottieSource(null);
  };

  const onChooseLottieUrl = async (url: string, slugName: string) => {
    setShowCurated(false);
    setLoadingLottie(true);
    const file = await fetchFileFromPublicURL(url);
    setChosenFile(file);
    setLoadingLottie(false);
  };

  const onClickChooseFile = async () => {
    const files = await uploadFile({
      accept: ".json,.lottie",
    });
    if (!files) {
      return;
    }
    setChosenFile(files[0]);
  };

  // The process of submission will require user to
  // 1. Sync the user to the server
  // 2. Upload the file to the server
  // If the user failed to do either way, the file will be saved offline
  const onClickSubmit = async () => {
    if (!chosenFile || !selectedCriteria) {
      setNotification({
        severity: "info",
        message: "Please choose a file and select the category",
      });
      return;
    }
    setLoadingCreate(true);

    try {
      await syncUser();

      const data = await uploadAsset(chosenFile, selectedCriteria);
      if (data) {
        // Sync the latest assets from the server, by checking the last sync status
        await syncAssets();
      }
      onClose();
    } catch (e) {
      console.error("Fail to upload", e);
      setNotification({
        severity: "error",
        message: "Fail to upload. Please try again.",
      });
    }
    setLoadingCreate(false);
  };

  const onChangeCriteria = (ev: ChangeEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLSelectElement;
    const value = target.value as Criteria;
    setSelectedCriteria(value);
  };

  const onClose = () => {
    setShowCurated(false);
    setLoadingCreate(false);
    setChosenFile(null);
    setLottieSource(null);
    setOpenModal(false);
  };

  // Side Effects

  // Responsively choose the criteria based on the selected criteria in the asset viewer
  useEffect(() => {
    if (criteria !== Criteria.ALL) {
      setSelectedCriteria(criteria);
    }
  }, [criteria]);

  // Determine how to handle either .json or .lottie files.
  // For .json, we can read the file content and extract it.
  // For .lottie, we directly pass it to the player and let the player handle it.
  useEffect(() => {
    if (chosenFile) {
      setLottieSource(URL.createObjectURL(chosenFile));
    } else {
      setLottieSource(null);
    }
  }, [chosenFile, setNotification]);

  return (
    <>
      <Button
        variant="primary"
        size="md"
        onClick={() => setOpenModal(true)}
        disabled={loadingCreate}
      >
        {loadingCreate ? "Adding..." : "Add New"}
      </Button>

      {/*
      There are multiple steps to create an asset:

      1. First, choose the source of the file:
        a. Choose a file
        b. Curate from LottieFiles Featured Public Animations
      2. Second, preview the animation and choose the criteria
      3. Third, submit the asset to the server
      */}

      <Modal open={openModal} size="lg" onClose={onClose}>
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <div className="flex items-center border-b-2 border-emerald-300 pb-2">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Upload new asset
              </h3>
            </div>
            <div>
              <div
                className={clsx(
                  "mt-2 grid items-center transition-all",
                  showCurated || lottieSource || loadingLottie
                    ? "h-10 w-full"
                    : "grid-rows-3 md:grid-cols-3 justify-center gap-4 h-96 w-64 md:w-96 m-auto",
                )}
              >
                {!showCurated && !lottieSource && !loadingLottie && (
                  <>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={onClickChooseFile}
                      disabled={loadingCreate}
                    >
                      Choose a File
                    </Button>
                    <div className="text-center">OR</div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={onClickCurate}
                      disabled={showCurated}
                    >
                      Find a Lottie
                    </Button>
                  </>
                )}
                {(showCurated || lottieSource) && (
                  <Button variant="secondary" onClick={onClickBack}>
                    Go Back
                  </Button>
                )}
              </div>
              <div className="mt-2 w-full">
                {/* Show Curated List from LottieFiles Featured Public Animations */}

                {showCurated && !lottieSource && (
                  <Curated onChooseLottieUrl={onChooseLottieUrl} />
                )}

                {/* Show message to the user that we're processing the files */}
                {loadingLottie && (
                  <div className="w-full flex justify-center">
                    <img
                      src="/logo192.png"
                      className="animate-spin w-12 h-12"
                      alt="loading"
                    />
                  </div>
                )}

                {/* Show the Animation Preview and Category to choose before deciding to submit */}

                {!showCurated && lottieSource && (
                  <>
                    <Preview source={lottieSource} />
                    <div className="flex items-center border-b-2 mt-2">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Select the criteria
                      </h3>
                    </div>
                    <Select
                      value={selectedCriteria}
                      onChange={onChangeCriteria}
                      options={criteriaOption}
                    />
                    <div className="mt-4">
                      <Button
                        variant="primary"
                        onClick={onClickSubmit}
                        disabled={loadingCreate}
                      >
                        {loadingCreate ? "Uploading..." : "Submit!"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
