const fs = require('fs');
const path = require('path');
let VIDEOS = require('../db/videos.json');

exports.getAllVideos = function() {
    return new Promise((resolve, reject) => {
        try {
            resolve(VIDEOS);
        }
        catch(err) {
            reject(err);
        }
    })
}

exports.getVideoPathById = function(id) {
    return new Promise((resolve, reject) => {
        try {
                let v = VIDEOS.find(v => {
                    return v['id'] == id;
                });
                if(v) {
                    resolve(v['file_name']);
                }
                else {
                    reject(new Error(`No video with id: ${id}`));
                }
        }
        catch(err) {
            reject(err);
        }
    })
}