export class HashManagerMock {
    public hash = async (plaintext: string): Promise<string> => {
        return "hash-mock"
    }

    public compare = async (plaintext: string, hash: string): Promise<boolean> => {
        switch(plaintext) {
            case "becca123":
                return hash === "hash-mock-becca"
            case "admin123":
                return hash == "hash-mock-admin"
            default:
                return false
        }
    }
}