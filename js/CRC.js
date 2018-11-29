var crcTable = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5,
    0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b,
    0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210,
    0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c,
    0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
    0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b,
    0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6,
    0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738,
    0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5,
    0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969,
    0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96,
    0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc,
    0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03,
    0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
    0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6,
    0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a,
    0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb,
    0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1,
    0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c,
    0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2,
    0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb,
    0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447,
    0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
    0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2,
    0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9,
    0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827,
    0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c,
    0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0,
    0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d,
    0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07,
    0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba,
    0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
    0x2e93, 0x3eb2, 0x0ed1, 0x1ef0]

// https://gist.github.com/chitchcock/5112270
// pre: string to find its CRC value.
// post: four-Characters string CRC value.
function crc16(s) {
    let crc = 0xFFFF
    let j = 0, i

    for (i = 0; i < s.length; i++) {

        c = s.charCodeAt(i)
        if (c > 255) {
            throw new RangeError()
        }
        j = (c ^ (crc >> 8)) & 0xFF
        crc = crcTable[j] ^ (crc << 8)
    }

    return ((crc ^ 0) & 0xFFFF)

}

// sets the amount in TLV format.
// crucial and can cause to generate wrong QR code.
// pre: value initialized and passed.
// post: Amount code in TLV format.
function setTableTLV(value) {

    let code = '0702'

    switch (value) {
        case '1':
        case '01':
            code += '01'
            break
        case '2':
        case '02':
            code += '02'
            break
        case '3':
        case '03':
            code += '03'
            break
        case '4':
        case '04':
            code += '04'
            break
        case '5':
        case '05':
            code += '05'
            break
        case '6':
        case '06':
            code += '06'
            break
        case '7':
        case '07':
            code += '07'
            break
        case '8':
        case '08':
            code += '08'
            break
        case '9':
        case '09':
            code += '09'
            break
        case '10':
            code += '10'
            break
        case '11':
            code += '11'
            break
        case '12':
            code += '12'
            break
        case '13':
            code += '13'
            break
        case '14':
            code += '14'
            break
        case '15':
            code += '15'
            break
        case '16':
            code += '16'
            break
        case '17':
            code += '17'
            break
        case '18':
            code += '18'
            break
        case '19':
            code += '19'
            break
        case '20':
            code += '20'
            break
        case '21':
            code += '21'
            break
        case '22':
            code += '22'
            break
        case '23':
            code += '23'
            break
        case '24':
            code += '24'
            break
        case '25':
            code += '25'
            break
        case '26':
            code += '26'
            break
        case '27':
            code += '27'
            break
        case '28':
            code += '28'
            break
        case '29':
            code += '29'
            break
        case '30':
            code += '30'
            break
        case '31':
            code += '31'
            break
        case '32':
            code += '32'
            break
        case '33':
            code += '33'
            break
        case '34':
            code += '34'
            break
        case '35':
            code += '35'
            break
        case '36':
            code += '36'
            break
        case '37':
            code += '37'
            break
        case '38':
            code += '38'
            break
        case '39':
            code += '39'
            break
        case '40':
            code += '40'
            break
        case '41':
            code += '41'
            break
        case '42':
            code += '42'
            break
        case '43':
            code += '43'
            break
        case '44':
            code += '44'
            break
        case '45':
            code += '45'
            break
        case '46':
            code += '46'
            break
        case '47':
            code += '47'
            break
        case '48':
            code += '48'
            break
        case '49':
            code += '49'
            break
        case '50':
            code += '50'
            break
        case '51':
            code += '51'
            break
        case '52':
            code += '52'
            break
        case '53':
            code += '53'
            break
        case '54':
            code += '54'
            break
        case '55':
            code += '55'
            break
        case '56':
            code += '56'
            break
        case '57':
            code += '57'
            break
        case '58':
            code += '58'
            break
        case '59':
            code += '59'
            break
        case '60':
            code += '60'
            break
        case '61':
            code += '61'
            break
        case '62':
            code += '62'
            break
        case '63':
            code += '63'
            break
        case '64':
            code += '64'
            break
        case '65':
            code += '65'
            break
        case '66':
            code += '66'
            break
        case '67':
            code += '67'
            break
        case '68':
            code += '68'
            break
        case '69':
            code += '69'
            break
        case '70':
            code += '70'
            break
        case '71':
            code += '71'
            break
        case '72':
            code += '72'
            break
        case '73':
            code += '73'
            break
        case '74':
            code += '74'
            break
        case '75':
            code += '75'
            break
        case '76':
            code += '76'
            break
        case '77':
            code += '77'
            break
        case '78':
            code += '78'
            break
        case '79':
            code += '79'
            break
        case '80':
            code += '80'
            break
        case '81':
            code += '81'
            break
        case '82':
            code += '82'
            break
        case '83':
            code += '83'
            break
        case '84':
            code += '84'
            break
        case '85':
            code += '85'
            break
        case '86':
            code += '86'
            break
        case '87':
            code += '87'
            break
        case '88':
            code += '88'
            break
        case '89':
            code += '89'
            break
        case '90':
            code += '90'
            break
        case '91':
            code += '91'
            break
        case '92':
            code += '92'
            break
        case '93':
            code += '93'
            break
        case '94':
            code += '94'
            break
        case '95':
            code += '95'
            break
        case '96':
            code += '96'
            break
        case '97':
            code += '97'
            break
        case '98':
            code += '98'
            break
        case '99':
            code += '99'
            break
    }

    return code
}

// takes input from user and returns the string containing the CRC value to generate QR code.
// Pre: cashier_id and value input.
// Post: string to generate QR code.
function generateQRCodeString(cashierId, tableNumber) {

    // define codes for QR
    const crcCode = '1104';
    const customerTLV = '020800000000';

    // calculate table TLV object
    let tableTLV = setTableTLV(tableNumber);
    let merchantTLV = '0105' + cashierId;

    // build QR string
    let qrStr = merchantTLV + customerTLV + tableTLV + crcCode;
    let crcTLV = crc16(qrStr).toString(16).toUpperCase();
    console.log(qrStr + crcTLV);
    return (qrStr + crcTLV); // returns a string.
}