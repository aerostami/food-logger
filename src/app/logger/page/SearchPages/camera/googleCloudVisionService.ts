import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class GoogleCloudVisionService {
    constructor(public http: HttpClient) {}
    getLabels(base64Image, feature) {
        const googleCloudVisionAPIKey = 'AIzaSyA_upwQ-NMorKBJyCHueGUqGz0fcmEAPZc';
        const body = {
            requests: [
                {
                    features: [
                        {
                            type: feature,
                            maxResults: 10
                        }
                    ],
                    image: {
                        content: base64Image
                    }
                }
            ]
        };
        return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + googleCloudVisionAPIKey, body);
    }
}
