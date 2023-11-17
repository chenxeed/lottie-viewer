import { useEffect, useState } from "react";
import { uploadFile } from "../../helper/fileUpload";
import { useUploadAsset } from "../../service/useUploadAsset";
import clsx from "clsx";
import { readFile } from "../../helper/fileReader";
import { Criteria } from "../../store/types";
import { useSyncAssets } from "../../service/useSyncAssets";
import { Button } from "@mui/material";
import { createPortal } from "react-dom";
import { useSyncUser } from "../../service/useSyncUser";
import { useStateSetNotification } from "../../store/notification";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Preview } from "./Preview";
import { Curated } from "./Curated";
import { fetchFileFromPublicURL } from "../../service/fileBucket";
import { useStateCriteria } from "../../store/assets";

const criteriaOption = [
  Criteria.GAME,
  Criteria.NATURE,
  Criteria.PEOPLE,
  Criteria.SCIENCE,
  Criteria.SHAPE,
  Criteria.TECH,
];

export const CreateAsset = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showCurated, setShowCurated] = useState(false);
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [lottieSource, setLottieSource] = useState<string | null>(null);
  const criteria = useStateCriteria();
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>(
    Criteria.SHAPE,
  );
  const [loadingLottie, setLoadingLottie] = useState(false);
  const [loading, setLoading] = useState(false);
  const syncUser = useSyncUser();
  const uploadAsset = useUploadAsset({ fallback: true });
  const syncAssets = useSyncAssets();
  const setNotification = useStateSetNotification();

  // Responsively choose the criteria based on the selected criteria in the asset viewer
  useEffect(() => {
    if (criteria !== Criteria.ALL) {
      setSelectedCriteria(criteria);
    }
  }, [criteria]);

  const onClickChooseFile = async () => {
    const files = await uploadFile({
      accept: ".json,.lottie",
    });
    if (!files) {
      return;
    }
    setChosenFile(files[0]);
  };

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
    // Generate the file from the URL
    const file = await fetchFileFromPublicURL(url);
    setChosenFile(file);
    setLoadingLottie(false);
  };

  // Determine how to handle either .json or .lottie files.
  // For .json, we can straight read the file content and extract it.
  // For .lottie, we straight pass it to the player and let the player handle it.
  useEffect(() => {
    if (chosenFile) {
      if (chosenFile.type === "application/json") {
        readFile(chosenFile, "text").then((content) => {
          if (content) {
            setLottieSource(content);
          } else {
            setNotification({
              severity: "error",
              message: "Fail to read the file. Please try again.",
            });
          }
        });
      } else if (chosenFile.name.endsWith(".lottie")) {
        setLottieSource(URL.createObjectURL(chosenFile));
      }
    } else {
      setLottieSource(null);
    }
  }, [chosenFile, setNotification]);

  const onClickSubmit = async () => {
    if (!chosenFile || !selectedCriteria) {
      setNotification({
        severity: "info",
        message: "Please choose a file and select the category",
      });
      return;
    }
    setLoading(true);

    // Before the file gets uploaded, make sure if the user has sync to the server
    // If the user hasn't, consider the app is still in offline mode and user can continue
    // uploading it to their local storage temporarily.

    try {
      await syncUser();

      const data = await uploadAsset(chosenFile, selectedCriteria);
      if (data) {
        onClose();
        // Sync the latest assets from the server, by checking the last sync status
        await syncAssets();
      }
    } catch (e) {
      console.error("Fail to upload", e);
      setNotification({
        severity: "error",
        message: "Fail to upload. Please try again.",
      });
    }
    setLoading(false);
  };

  const onChangeCriteria = (ev: SelectChangeEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLSelectElement;
    const value = target.value as Criteria;
    setSelectedCriteria(value);
  };

  const onClose = () => {
    setShowCurated(false);
    setLoading(false);
    setChosenFile(null);
    setLottieSource(null);
    setOpenModal(false);
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        className="w-24 text-xs md:w-32 md:text-base"
        onClick={() => setOpenModal(true)}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add New Lottie"}
      </Button>
      {createPortal(
        <div
          className={clsx(
            "fixed z-10 inset-0 overflow-hidden",
            openModal
              ? "opacity-100 transition-all translate-y-0"
              : "h-0 w-0 opacity-0 -translate-y-60",
          )}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 overflow-hidden w-full h-full bg-slate-600 opacity-50" />
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-4xl min-h-[95vh] min-w-[320px]">
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6 text-gray-400 hover:text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <div className="flex items-center border-b-2 border-emerald-300 pb-2">
                        <h3
                          className="text-base font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Upload new asset
                        </h3>
                      </div>
                      <div>
                        <div
                          className={clsx(
                            "mt-2 grid items-center transition-all",
                            showCurated || lottieSource
                              ? "h-10 w-full"
                              : "grid-cols-3 gap-4 h-96 w-64 md:w-96 m-auto",
                          )}
                        >
                          {!showCurated && !lottieSource && (
                            <>
                              <Button
                                variant="outlined"
                                onClick={onClickChooseFile}
                                disabled={loading}
                              >
                                Choose a File
                              </Button>
                              <div className="text-center">OR</div>
                              <Button
                                variant="outlined"
                                onClick={onClickCurate}
                                disabled={showCurated}
                              >
                                Find a Lottie
                              </Button>
                            </>
                          )}
                          {(showCurated || lottieSource) && (
                            <Button variant="outlined" onClick={onClickBack}>
                              Go Back
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 w-full">
                          {/* Show Curated List from LottieFiles Featured Public Animations */}

                          {showCurated && !lottieSource && (
                            <>
                              <Curated onChooseLottieUrl={onChooseLottieUrl} />
                            </>
                          )}

                          {/* Show message to the user that we're processing the files */}
                          {loadingLottie && (
                            <>
                              <div className="flex items-center border-b-2 mt-2">
                                <h3
                                  className="text-base font-semibold leading-6 text-gray-900"
                                  id="modal-title"
                                >
                                  Processing the file
                                </h3>
                              </div>
                              <div className="text-center mt-2">
                                <div className="text-xs md:text-base">
                                  Please wait...
                                </div>
                              </div>
                            </>
                          )}

                          {/* Show the Animation Preview and Category to choose before deciding to submit */}

                          {!showCurated && lottieSource && (
                            <>
                              <Preview source={lottieSource} />
                              <div className="flex items-center border-b-2 mt-2">
                                <h3
                                  className="text-base font-semibold leading-6 text-gray-900"
                                  id="modal-title"
                                >
                                  Select the category
                                </h3>
                              </div>
                              <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                  <Select
                                    id="filter-criteria"
                                    value={selectedCriteria}
                                    onChange={onChangeCriteria}
                                  >
                                    {criteriaOption.map((criteria, idx) => (
                                      <MenuItem key={idx} value={criteria}>
                                        {criteria}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Box>
                              <div className="mt-4">
                                <Button
                                  variant="contained"
                                  onClick={onClickSubmit}
                                  disabled={loading}
                                >
                                  {loading ? "Uploading..." : "Submit!"}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};
