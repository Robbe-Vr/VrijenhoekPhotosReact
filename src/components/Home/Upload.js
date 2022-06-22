import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faTrash, faUtensils } from "@fortawesome/free-solid-svg-icons";

import Photo from "../../models/Photo";

import { UserInputComponent } from "../Global/UserInputComponent";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useNotifications } from "../Global/NotificationContext";
import { Video } from "../Global/Video";
import { Image } from "../Global/Image";
import { Warning } from "@material-ui/icons";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";


const useStyles = makeStyles(() => ({
    form: {
        width: '100%',
        height: '100%',
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },
}));

export default function UploadPage({ setTitle, Api, renderMobile }) {
    useEffect(() => {
        setTitle && setTitle("Upload");
    });

    const classes = useStyles();

    const history = useHistory();

    const { error, warning, success } = useNotifications();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [loadingSelectedPhotos, setLoadingSelectedPhotos] = useState(false);

    const [previewFile, setPreviewFile] = useState(null);

    const loadPreview = async (index) => {
        if (index < 0 || index >= selectedFiles.length) { return; }

        setLoadingSelectedPhotos(true);

        const readFile = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function (ev) {
                    resolve(ev.target.result);
                };

                reader.readAsDataURL(file);
            });
        };

        var preview = await readFile(selectedFiles[index]?.file);

        setPreviewFile({ index: index, preview });

        setLoadingSelectedPhotos(false);
    };

    const setSelectedContent = (values) => {
        var newFiles = [];

        const processFile = (value, index, max) => {
            if (!value) {
                warning(`Unable to process file!`);
                return;
            }

            if (value.size > 2_000_000_000) {
                warning(`Ignoring file: ${value.name}.\nCannot process files greater than 2GB!`);
                return;
            }

            newFiles.push({ file: value, type: value.type, isVideo: value.type?.length == 0 ? true : value.type.startsWith('video') });

            index++;
            if (index < max) {
                processFile(values[index], index, max);
            }
        };

        processFile(values[0], 0, values.length);

        setSelectedFiles(newFiles);
        setPreviewFile(null);
    };

    const updateFileName = (index, newName) => {
        var newSelection = [...selectedFiles];

        if (index > -1) {
            var nameSplit = newSelection[index].file.name.split(/\./g);

            let ext = nameSplit[nameSplit.length - 1];

            newSelection[index].file.customname = newName + '.' + ext;

            setSelectedFiles(newSelection);
        }
    };

    const removeSelectedFile = (file) => {
        var newSelection = [...selectedFiles];
        newSelection.splice(newSelection.indexOf(file), 1);
        setSelectedFiles(newSelection);
    };

    const uploadPhoto = () => {
        if (selectedFiles.length < 1) {
            warning('Select at least one file first!');
            return;
        }

        for (let i = 0; i < selectedFiles.length; i++)
        {
            let formData = new FormData();

            var nameSplit = (selectedFiles[i].file.customname || selectedFiles[i].file.name).split(/\./g);

            let type = nameSplit[nameSplit.length - 1].toLowerCase();
            nameSplit.pop();
            let name = nameSplit.join('.');

            formData.append('CreationDate', selectedFiles[i].file.lastModifiedDate?.toISOString() || undefined);
            formData.append('Name', name);
            formData.append('Type', '.' + type);
            formData.append('ImageFile', selectedFiles[i].file);

            setUploadLoading(true);

            Api.UploadImage(formData).then((res) => {
                if (res instanceof String || typeof res == 'string') {
                    error(`Failed to upload ${selectedFiles[i].file.customname || selectedFiles[i].file.name}!`);
                }
                else if (res.status != 200) {
                    if (res.detail)
                    {
                        error(`Sorry! ${res.detail}`);
                    }
                    else error(`Failed to upload ${selectedFiles[i].file.customname || selectedFiles[i].file.name}!`);
                    console.log(`Failed to upload ${selectedFiles[i].file.customname || selectedFiles[i].file.name}!`, res);
                }
                else {
                    success(`Photo ${selectedFiles[i].file.customname || selectedFiles[i].file.name} was uploaded!`);
                }

                setUploadLoading(false);

                if (i >= selectedFiles.length - 1) {
                    history.push('/home');
                }
            });
        }
    };

    return (
        <div className={classes.form} style={{ height: '100%' }}>
            <Grid style={{ width: '100%', minHeight: '50%', padding: '20px', color: 'white' }}>
                <Grid style={{ width: renderMobile ? '100%' : '60%', height: '20%', display: 'block', padding: '10px' }}>
                    Choose files to upload:<br />
                    <Button variant="contained" component="label"
                        style={{ backgroundColor: '#222', color: '#2DF' }}
                    >
                        <input
                            style={{ color: 'white', borderColor: 'white' }}
                            multiple
                            name="Photo"
                            type="file"
                            onLoadStart={() => setLoadingSelectedPhotos(true)}
                            onLoadedData={() => setLoadingSelectedPhotos(false)}
                            onChange={(e) => {
                                setLoadingSelectedPhotos(true);

                                setSelectedContent(e.target.files);

                                setLoadingSelectedPhotos(false);
                            }}
                            accept={"image/png,image/jpeg,image/jpg,image/bmp,image/ico,image/tiff,image/webp,image/svg+xml,image/vnd.microsoft.icon,image/avif,image/gif" + "," +
                                "video/mp4,video/mpeg,video/ogg,video/x-msvideo,video/webm"}
                        />
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', display: 'block', padding: '10px' }}>
                    <ul>
                        <li><b>After selecting files with the button above, the page may freeze for some time to get the selected files ready to be uploaded!</b></li>
                        <li><b>Files bigger than 2GB cannot be be processed and will be ignored!</b></li>
                        {selectedFiles.length > 1 ? <li><b>Uploading multiple files at once might take a while!</b></li> : <></>}
                    </ul>
                    <Button variant="outlined"
                        style={{ backgroundColor: 'forestgreen', color: 'white', textTransform: 'none' }}
                        onClick={() => !uploadLoading && uploadPhoto()}
                    >
                        <Typography variant="h5">Upload Photo{selectedFiles.length > 1 ? 's' : ''}</Typography>
                        {uploadLoading ?
                            <CircularProgress style={{ marginLeft: '5px' }}/>
                            : <></>
                        }
                    </Button>
                </Grid>
                Selected Photos: {selectedFiles.length || 0}<br />
                <Grid style={{ width: '100%', display: 'block', padding: '10px' }}>
                    Select a file for a preview and set a different upload name:
                    <UserSelectInputComponent name="preview"
                        style={{ backgroundColor: '#4466FF' }}
                        options={Array.isArray(selectedFiles) && selectedFiles.length > 0 ? selectedFiles.map((file, index) => {
                            var sizeGroups = ['Bytes', 'Kb', 'Mb', 'Gb'];
                            let sizeGroupIndex = 0;

                            let readableSize = file.file.size;
                            let dummyReadableSize = 0;
                            while ((dummyReadableSize = readableSize / 1024) > 0.5)
                            {
                                sizeGroupIndex++;

                                readableSize = dummyReadableSize;
                            }

                            return {
                                id: index,
                                name: `${file.file.customname || file.file.name} - ${readableSize} ${sizeGroups[sizeGroupIndex]}`,
                                value: index
                            };
                        }) : [{ id: -1, name: 'No files selected!', value: -1 }]}
                        value={previewFile?.index || -1}
                        onChange={loadPreview}
                        isAsync
                    />
                </Grid>
                {loadingSelectedPhotos ?
                    <>
                        <CircularProgress style={{ marginLeft: '5px' }}/>
                    </>
                : <></>}
                {previewFile ?
                    <>
                        <Grid key={selectedFiles[previewFile.index].file.customname || selectedFiles[previewFile.index].file.name} style={{ width: '100%', marginBottom: '10px', borderBottom: 'solid 1px #2DF', display: 'block', padding: '10px' }}>
                            {selectedFiles[previewFile.index].isVideo ? selectedFiles[previewFile.index].type.endsWith('mp4') ?
                                <Video
                                    controls
                                    source={previewFile.preview}
                                    maxHeight={window.innerHeight * 0.3}
                                    autoWidth
                                /> : 'Cannot play this file type. (will be converted when uploaded)'
                                :
                                <Image
                                    source={previewFile.preview}
                                    maxHeight={window.innerHeight * 0.3}
                                    autoWidth
                                />
                            }
                            <Grid style={{ width: renderMobile ? '100%' : '60%', display: 'block', padding: '10px' }}>
                                <UserInputComponent
                                    style={{ color: 'white', borderColor: 'white' }}
                                    inputProps={{
                                        style: {
                                            color: 'white', backgroundColor: '#555555',
                                        }
                                    }}
                                    defaultValue={selectedFiles[previewFile.index].file.customname || selectedFiles[previewFile.index].file.name}
                                    value={selectedFiles[previewFile.index].file.customname || selectedFiles[previewFile.index].file.name}
                                    name="FileName (optional)"
                                    onChange={(value) => updateFileName(previewFile.index, value)}
                                />
                            </Grid>
                            <Button variant="outlined"
                                style={{ backgroundColor: '#F24', color: 'white', marginTop: '5px', textTransform: 'none' }}
                                onClick={() => {
                                    removeSelectedFile(selectedFiles[previewFile.index]);

                                    setPreviewFile(null);
                                }}
                            >
                                Remove <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '5px' }} />
                            </Button>
                        </Grid>
                    </>
                    : <></>
                }
            </Grid>
        </div>
    );
};