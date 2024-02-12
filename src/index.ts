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

class APIResult {
    result: boolean;
    message: string;
    constructor(result: boolean, message: string) {
        this.result = result;
        this.message = message;
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
     * @returns A class of user
     */
    async getUser(): Promise<User> {
        const url = `${BASE_URL}/api/user`;
        const data = (await instance.get(url, { headers: this.headers })).data;
        const user = new User(data._id, data.name, data.email, data.image, data.count as number)
        return user
    }

    /**
     * Get all user's links
     * @returns An array of links
     */
    async getLinks(): Promise<Array<Link>> {
        const url = `${BASE_URL}/api/links`;
        const list = (await instance.get(url, { headers: this.headers })).data;
        return list.map((link: any) => new Link(link._id, link.name, link.url, link.folder));
    }

    /**
     * Get all user's folders with or without links inside
     * @returns An array of folders
     */
    async getFolders(withLinks: boolean = false): Promise<Array<Folder>> {

        const url = `${BASE_URL}/api/folders`;
        const folders = (await instance.get(url, { headers: this.headers })).data as Array<any>;;
        if (!withLinks) return folders.map((f: any) =>
            new Folder(f._id,
                f.name,
                f.public,
                `https://lindle.click/${f?.codename || ""}`,
                f?.sharedEmails || []
            )
        );
        const list = await this.getLinks();
        const folderList = folders.map((f: any) => {
            const folder = new Folder(f._id,
                f.name,
                f.public,
                `https://lindle.click/${f?.codename || ""}`,
                f.sharedEmails,
                list.filter(link => link.folder === f._id)
                    .map((link: any) => new Link(link._id, link.name, link.url, link.folder))
            );
            return folder
        })
        return folderList;
    }

    /**
     * Get all user's folders with or without links inside
     * @returns An array of folders and links for bookmarks
     */
    async getSyncedBookmarks() {
        const url = `${BASE_URL}/api/links/bookmarks/sync`;
        const data = (await instance.get(url, { headers: this.headers })).data;
        const { folders, links } = data;
        return {
            folders: folders.map((link: any) => new BookmarkFolder(link.id, link.name, link.folder, link.date)),
            links: links.map((link: any) => new Bookmark(link.id, link.name, link.folder, link.date, link.url))
        };
    }


    /**
     * Create link
     */
    async createLink(name: string, url: string, favourite: boolean = false, folderId: string): Promise<APIResult> {
        const res = await instance.post(`${BASE_URL}/api/links`, { name, url, folder: folderId, favourite }, { headers: this.headers });
        const data = res.data;
        return new APIResult(data.result, data.message);
    }


    /**
     * Create folder
     */
    async createFolder(name: string, publicFolder: boolean, sharedEmails: Array<string>): Promise<APIResult> {
        const res = await instance.post(`${BASE_URL}/api/folders`, { name, public: publicFolder, sharedEmails }, { headers: this.headers });
        const data = res.data;
        return new APIResult(data.result, data.message);
    }


    /**
     * Update link
     */
    async updateLink(id: string, name: string, url: string, favourite: boolean, folderId: string): Promise<APIResult> {
        const res = await instance.post(`${BASE_URL}/api/links/${id}`, { name, url, folder: folderId, favourite }, { headers: this.headers });
        const data = res.data;
        return new APIResult(data.result, data.message);
    }


    /**
     * Rename folder
     */
    async updateFolder(id: string, name: string, publicFolder: boolean, sharedEmails: Array<string>): Promise<APIResult> {
        const res = await instance.patch(`${BASE_URL}/api/folders/${id}`, { name, public: publicFolder, sharedEmails }, { headers: this.headers });
        const data = res.data;
        return new APIResult(data.result, data.message);
    }


    /**
     * Delele link
     */
    async deleteLink(id: string): Promise<APIResult> {
        const res = await instance.delete(`${BASE_URL}/api/links/${id}`, { headers: this.headers });
        const data = res.data;
        return new APIResult(data.result, data.message);
    }


    /**
     * Delele folder
     */
    async deleteFolder(id: string): Promise<APIResult> {
        const res = await instance.delete(`${BASE_URL}/api/folders/${id}`, { headers: this.headers });
        const data = res.data;
        return new APIResult(data.result, data.message);
    }


}
