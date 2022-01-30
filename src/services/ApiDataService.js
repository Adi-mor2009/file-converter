import axios from "axios";

const SERVER_URL = "http://localhost:8080/";

async function getFiles() {
    debugger
    const getURL = SERVER_URL + "files";
    console.log(getURL);
    try {
        const res = await axios.get(getURL, {
            headers: {
                "Content-type": "application/json"
            }});
        debugger
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while geting files', err);
        return({response: null, error: err});
    }
}

// async function getDataById(type, id) {
//     const getURL = SERVER_URL + type + "/" + id;
//     try {
//         const res = await axios.get(getURL);
//         return({response: res, error: null});
//     } catch (err) {
//         console.error('Error while geting ' + type + " with id= " + id, err);
//         return({response: null, error: err});
//     }
// }

async function postData(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);
 
    const postURL = SERVER_URL + "upload";
    try {
        debugger
        const res = await axios.post(postURL,  formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
        debugger
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while creating file' + " with data:" + formData, err);
        return({response: null, error: err});
    }
}

// async function putData(type, id, data) {
//     const putURL = SERVER_URL + type + "/" + id;
//     try {
//         const res = await axios.put(putURL, data);
//         debugger
//         return({response: res, error: null});
//     } catch (err) {
//         console.error('Error while editing ' + type + " " + id, err);
//         return({response: null, error: err});
//     }
// }

// async function deleteData(type, id) {
//     const deleteURL = SERVER_URL + type + "/" + id;
//     try {
//         const res = await axios.delete(deleteURL);
//         return({response: res, error: null});
//     } catch (err) {
//         console.error('Error while deleting ' + type + " " + id, err);
//         return({response: null, error: err});
//     }
// }

export default { getFiles, postData }