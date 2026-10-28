import { http } from '@pterodactyl/sdk';

export interface UserFile {
    expiresOn: string;
    name: string;
    uuid: string;
    isOp: boolean;
}

interface OpEntry {
    uuid: string;
    name: string;
    level: number;
    bypassesPlayerLimit: boolean;
}

const getUserFile = async (serverId: string): Promise<UserFile[]> => {
    const [usercacheRes, opsData] = await Promise.all([
        http.get(`/api/client/servers/${serverId}/files/contents?file=usercache.json`),
        http.get(`/api/client/servers/${serverId}/files/contents?file=ops.json`)
            .then((res) => {
                if (res.status !== 200) return [];
                const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                return Array.isArray(data) ? (data as OpEntry[]) : [];
            })
            .catch(() => [] as OpEntry[])
    ]);

    if (usercacheRes.status !== 200) {
        throw new Error(`Failed to fetch user file: ${usercacheRes.statusText}`);
    }

    const rawUsers = typeof usercacheRes.data === 'string' 
        ? JSON.parse(usercacheRes.data) 
        : usercacheRes.data;

    const opUuids = new Set(opsData.map((op) => op.uuid.toLowerCase()));

    return (rawUsers as Omit<UserFile, 'isOp'>[]).map((user) => ({
        ...user,
        isOp: opUuids.has(user.uuid.toLowerCase()),
    }));
};

export default getUserFile;