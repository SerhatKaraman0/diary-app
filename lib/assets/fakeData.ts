export const fakeData = [
    {
        $id: "1",
        position: JSON.stringify({ x: 100, y: 100 }),
        colors: JSON.stringify({
            colorHeader: "#4A90E2",
            colorBody: "#FFFFFF",
            colorText: "#000000"
        }),
        body: JSON.stringify("This is a sample note for testing the diary app.")
    },
    {
        $id: "2",
        position: JSON.stringify({ x: 400, y: 200 }),
        colors: JSON.stringify({
            colorHeader: "#E24A67",
            colorBody: "#FFFFFF",
            colorText: "#000000"
        }),
        body: JSON.stringify("Another test note with different position and colors.")
    }
];