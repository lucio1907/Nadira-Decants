const data = [
    { location: { address: { postalCode: "2900" } }, name: "San Nicolas" },
    { location: { address: { postalCode: "2930" } }, name: "San Pedro" },
    { location: { address: { postalCode: "1000" } }, name: "CABA" },
    { location: { address: { postalCode: "7600" } }, name: "Mar del Plata" },
    { location: { address: { postalCode: "2942" } }, name: "Baradero Exact" }
];

const normalizeZip = (cp: string) => {
    const clean = cp.toUpperCase().replace(/\s/g, "");
    const match = clean.match(/[A-Z]?(\d{4})[A-Z]{0,3}/);
    return match ? match[1] : clean;
};

const searchZip = "2941"; // close to Baradero
const searchNum = parseInt(searchZip, 10);

const withDiff = data.map((b: any) => {
    const bZipRaw = String(b.location?.address?.postalCode || "").trim();
    const bZip = normalizeZip(bZipRaw);
    const bNum = parseInt(bZip, 10);
    const diff = isNaN(bNum) ? 999999 : Math.abs(bNum - searchNum);
    return { b, diff, bZip };
}).filter(x => x.bZip);

withDiff.sort((x, y) => x.diff - y.diff);
console.log(withDiff.slice(0, 3).map(x => `${x.b.name} (Diff: ${x.diff})`));
