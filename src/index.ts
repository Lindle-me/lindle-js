import axios from 'axios';
const instance = axios.create();
const BASE_URL = `https://www.lindle.me`;


class User {
    name: string;
    email: string;
    image: string;
    linkLimit: number;
    constructor(name: string, email: string, image: string, count: number) {
        this.name = name;
        this.email = email;
        this.image = image;
        this.linkLimit = count;
    }
}


export class Lindle {
    apiKey: string; // Declare the apiKey property
    headers: any // Headers for API

    /**
     * Get started with Lindle API
     * @param {*} apiKey Lindle API key - Get API Key/Token from chrome extension - https://chrome.google.com/webstore/detail/igkkojjaikfmiibedalhgmfnjohlhmaj?authuser=0&hl=en
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    }


    /**
     * Get user's info
     * @returns A json array of {name, voice_id, ...} and more 
     */
    async getUser(): Promise<User> {
        const url = `${BASE_URL}/api/user`;
        const data = (await instance.get(url, { headers: this.headers })).data;
        const user = new User(data.name, data.email, data.image, data.count as number)
        return user
    }

    /**
     * Get all user's links
     * @returns A json array of {name, voice_id, ...} and more 
     */
    async getLinks(): Promise<Array<any>> {
        const url = `${BASE_URL}/api/links`;
        return (await instance.get(url, { headers: this.headers })).data;
    }

    /**
     * Get all user's folders with or without links inside
     * @returns A json array of {name, voice_id, ...} and more 
     */
    async getFolders(withLinks: boolean = false): Promise<Array<any>> {

        const url = `${BASE_URL}/api/folders`;
        const folders = (await instance.get(url, { headers: this.headers })).data as Array<any>;;
        if (!withLinks) return folders
        const list = await this.getLinks();
        return folders.map(folder => {
            return {
                ...folder,
                links: list.filter(link => link.folder === folder._id)
            }
        })
    }
}

