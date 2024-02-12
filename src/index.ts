import axios from 'axios';
const instance = axios.create();
const BASE_URL = `https://www.lindle.me`;


class User {
    id: string;
    name: string;
    email: string;
    image: string;
    linkLimit: number;
    constructor(id: string, name: string, email: string, image: string, count: number) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.image = image;
        this.linkLimit = count;
    }
}

class Link {
    id: string;
    name: string;
    url: string;
    folder: string;
    constructor(id: string, name: string, url: string, folder: string) {
        this.name = name;
        this.id = id;
        this.url = url;
        this.folder = folder;
    }
}

class Folder {
    id: string;
    name: string;
    publicFolder: boolean;
    journeyLink: string;
    sharedEmails: Array<string>;
    links: Array<Link>;
    constructor(id: string, name: string, publicFolder: boolean, journeyLink: string, sharedEmails: Array<string>, links: Array<Link> = []) {
        this.id = id;
        this.name = name;
        this.publicFolder = publicFolder;
        this.journeyLink = journeyLink;
        this.sharedEmails = sharedEmails;
        this.links = links ? links : []
    }
}

class Bookmark {
    id: string;
    name: string;
    folder: string;
    date: string;
    url: string;
    constructor(id: string, name: string, folder: string, date: string, url: string) {
        this.id = id;
        this.name = name;
        this.folder = folder;
        this.date = date;
        this.url = url;
    }
}

class BookmarkFolder {
    id: string;
    name: string;
    folder: string;
    date: string;
    constructor(id: string, name: string, folder: string, date: string) {
        this.id = id;
        this.name = name;
        this.folder = folder;
        this.date = date;
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
        const user = new User(data._id, data.name, data.email, data.image, data.count as number)
        return user
    }

    /**
     * Get all user's links
     * @returns A json array of {name, voice_id, ...} and more 
     */
    async getLinks(): Promise<Array<Link>> {
        const url = `${BASE_URL}/api/links`;
        const list = (await instance.get(url, { headers: this.headers })).data;
        return list.map((link: any) => new Link(link._id, link.name, link.url, link.folder));
    }

    /**
     * Get all user's folders with or without links inside
     * @returns A json array of {name, voice_id, ...} and more 
     */
    async getFolders(withLinks: boolean = false): Promise<Array<Folder>> {

        const url = `${BASE_URL}/api/folders`;
        const folders = (await instance.get(url, { headers: this.headers })).data as Array<any>;;
        if (!withLinks) return folders
        const list = await this.getLinks();
        return folders.map((f: any) => {
            const folder = new Folder(f._id,
                f.name,
                f.public,
                `https://lindle.click/${f.codename}`,
                f.sharedEmails,
                list.filter(link => link.folder === f._id)
                    .map((link: any) => new Link(link._id, link.name, link.url, link.folder))
            );
            return folder
        })
    }

    async getSyncedBookmarks() {

    }
}

