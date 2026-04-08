const axios = require('axios');

const BASE_URL = 'https://api.sylica.eu.org/terabox/';
const headers = {
    authority: 'api.sylica.eu.org',
    origin: 'https://www.kauruka.com',
    referer: 'https://www.kauruka.com/',
    'user-agent': 'Postify/1.0.0'
};

// ================= EXTRACT ID =================
const extractId = (link) => {
    const match = link.match(/s\/([a-zA-Z0-9]+)$|surl=([a-zA-Z0-9]+)/);
    return match ? (match[1] || match[2]) : null;
};

// ================= FORMAT RESPONSE =================
const formatResponse = (data, includeDL = false) => {
    const result = {
        filename: data.filename,
        size: data.size,
        shareid: data.shareid,
        uk: data.uk,
        sign: data.sign,
        timestamp: data.timestamp,
        createTime: data.create_time,
        fsId: data.fs_id,
        message: data.message || 'No message'
    };

    if (includeDL) {
        result.download = data.downloadLink;
    }

    return result;
};

// ================= MAIN CLASS =================
const terabox = {

    // 🔍 GET FILE INFO
    detail: async (link) => {
        const id = extractId(link);
        if (!id) throw new Error('Invalid Terabox link.');

        try {
            const { data } = await axios.get(`${BASE_URL}?id=${id}`, { headers });

            if (!data || !data.data) {
                throw new Error('No data returned from API.');
            }

            return formatResponse(data.data);

        } catch (err) {
            console.error('DETAIL ERROR:', err.message);
            throw new Error('Failed to fetch file details.');
        }
    },

    // ⬇️ GET DOWNLOAD LINK
    dl: async (link) => {
        const id = extractId(link);
        if (!id) throw new Error('Invalid Terabox link.');

        try {
            const { data } = await axios.get(`${BASE_URL}?id=${id}&download=1`, { headers });

            if (!data || !data.data) {
                throw new Error('No download data returned.');
            }

            return formatResponse(data.data, true);

        } catch (err) {
            console.error('DOWNLOAD ERROR:', err.message);
            throw new Error('Failed to fetch download link.');
        }
    }

};

module.exports = { terabox };