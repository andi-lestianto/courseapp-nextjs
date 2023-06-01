


export default function convertDate(value) {
    let date = new Date(value);
    let tgl = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return tgl;
}