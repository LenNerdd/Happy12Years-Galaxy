async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function checkNoteCode() {
    if (OpenedWithPassword == false) {
        const hashedPassword = '4f5d335068c7a88fbcc89c2a91d807e4ec6977a925ed67219f15b401dc8c85a0';
        const password = prompt('Enter the password to view the note:');

        if (password === null) {
            return null;
        }

        const enteredPasswordHash = await hashPassword(password);

        if (enteredPasswordHash === hashedPassword) {
            OpenedWithPassword = true;
            return true;
        } else {
            return false;
        }
    }
}
