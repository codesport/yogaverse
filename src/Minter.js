import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
 
  //https://stackoverflow.com/a/53332372
  //As a workaround for the warning you can use a self invoking async function
  useEffect( () => {
    ( async () => {
        const {address, status} = await getCurrentWalletConnected();
        setWallet(address)
        setStatus(status);
        }
    )()
    addWalletListener(); 
}, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
};



  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a rel="noreferrer"  target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }



  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Yoga Pass Demo: Moralis + Polygon + Alchemy</h1>
      <h2>Minting Contract Address: 0x30CAfB60463f886ce44ec2CE72eBe9EeB607Dd50</h2>
      <h2>Instructions</h2>
      <p>
        1. Pin Your asset to Moralis' IPFS gateway here: <a href="https://xrxkrjknjqyo.usemoralis.com/">https://xrxkrjknjqyo.usemoralis.com/</a>
      </p>
      <p>2. Use this form to mint your image to Polygon as an NFT</p>
      <p>3. Confirm Minting Volume and Activity here: https://mumbai.polygonscan.com/address/0x30CAfB60463f886ce44ec2CE72eBe9EeB607Dd50</p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://ipfs.moralis.io:2053/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2> Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2> Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
