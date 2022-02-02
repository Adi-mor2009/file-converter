import './UploadFiles.css';
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import ApiDataService from '../../services/ApiDataService';

function UploadFiles() {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [fileInfos, setFileInfos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUploadError, setShowUploadError] = useState(false);
    const [showModalRemoveAllFiles, setShowModalRemoveAllFiles] = useState(false);
    const [showRemoveError, setShowRemoveError] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const files = await ApiDataService.getFiles();
            setLoading(false);
            if (files.error) {
                setShowUploadError(true);
                setProgress(0);
                setMessage("Could not upload the file!");
                setCurrentFile(undefined);
                //setSelectedFiles(undefined);
            }
            else {
                setFileInfos(files.response.data);
            }
        })()
    }, [])

    function selectFile(event) {
        setSelectedFiles(event.target.files);
    }

    async function onDelete(fileName) {
        console.log(fileName);
        setShowModalRemoveAllFiles(false);
        setLoading(true);
        const fileToRemove = await ApiDataService.deleteFile(fileName);
        setLoading(false);
        if (fileToRemove.error) {
            setShowRemoveError(true);
        }
        else {
            setMessage(fileToRemove.response.data.message);
            setLoading(true);
            const files = await ApiDataService.getFiles();
            setLoading(false);
            if (files.error) {
                setShowUploadError(true);
                setProgress(0);
                setMessage("Could not get list of files!");
                //setCurrentFile(undefined);
                //setSelectedFiles(undefined);
            }
            else {
                setFileInfos(files.response.data);
            }
            setCurrentFile(undefined);
        }
    }

    async function deleteAllFiles() {
        //e.preventDefault();
        console.log("Going to delete all files from list");
        setLoading(true);
        const filesToRemove = await ApiDataService.deleteAllData();
        setLoading(false);
        if (filesToRemove.error) {
            setShowRemoveError(true);
        }
        else {
            setShowModalRemoveAllFiles(false);
            setMessage(filesToRemove.response.data.message);
            setLoading(true);
            const files = await ApiDataService.getFiles();
            setLoading(false);
            if (files.error) {
                setShowUploadError(true);
                setProgress(0);
                setMessage("Could not upload the file!");
                //setCurrentFile(undefined);
                //setSelectedFiles(undefined);
            }
            else {
                setFileInfos(files.response.data);
            }
            setCurrentFile(undefined);
        }
    }

    async function upload() {
        let currentFile = selectedFiles[0];
        setProgress(0);
        setCurrentFile(currentFile);

        setLoading(true);
        const response = await ApiDataService.postData(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        });
        setLoading(false);
        if (response.error) {
            setShowUploadError(true);
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
            //setSelectedFiles(undefined);
        }
        else {
            debugger
            setMessage(response.response.data.message);
            setLoading(true);
            const files = await ApiDataService.getFiles();
            setLoading(false);
            if (files.error) {
                setShowUploadError(true);
                setProgress(0);
                setMessage("Could not upload the file!");
                //setCurrentFile(undefined);
                //setSelectedFiles(undefined);
            }
            else {
                setFileInfos(files.response.data);
            }
            setCurrentFile(undefined);
        }
        setSelectedFiles(undefined);
    }
    return (
        <div>
            {loading && <div className="p-home-spinner"><Spinner animation="border" variant="primary" /></div>}
            {currentFile && (
                <div className="progress">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
            )}

            <label className="btn btn-default">
                <input type="file" onChange={selectFile} accept=".xml"/>
            </label>

            <button
                className="btn btn-success"
                disabled={!selectedFiles}
                onClick={upload}
            >
                <i className="bi bi-upload"></i>  Upload
            </button>

            <div className="alert alert-light" role="alert">
                {message}
            </div>

            {fileInfos.length > 0 && <div className="card">
                <div className="card-header">List of MarcXml Files <Button variant="light" onClick={() => setShowModalRemoveAllFiles(true)}><i className="bi bi-trash" style={{ color: 'red' }}></i></Button></div>
                <ul className="list-group list-group-flush">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                                <a style={{ textDecoration: 'none' }} href={file.url}>{file.name}</a>
                                <div className="actions-file">
                                    <a style={{ textDecoration: 'none' }} href={file.url}><Button variant="light"><i className="bi bi-download" style={{ color: 'blue' }}></i></Button></a>
                                    <Button variant="light" onClick={() => onDelete(file.name)}><i className="bi bi-trash" style={{ color: 'red' }}></i></Button>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>}
            <Modal show={showModalRemoveAllFiles} onHide={() => setShowModalRemoveAllFiles(false)} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Remove all files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showRemoveError ? <Alert variant="danger">Error in Removal!</Alert> : null}
                    Are you sure you want to delete all files?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={deleteAllFiles}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={() => setShowModalRemoveAllFiles(false)}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default UploadFiles;