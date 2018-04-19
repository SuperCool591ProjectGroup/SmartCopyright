var Copyright = artifacts.require("./Copyright.sol");

contract("Copyright!", function (accounts) {
  it("should return one right after you register", async function() {
    let c = await Copyright.deployed();
    await c.userRegister();
    // let count = await c.checkUsersCount.call();
    // console.log("Count = " + count);
    let amIRegistered = await c.amIRegistered.call();
    assert.equal(amIRegistered, true);
  });

  it("should return right price after registered", async function () {
    const contract = await Copyright.deployed();

    let songName = "hello world";
    let price = 1000;
    // function registerCopyright(string name, uint price, address[] holders, uint[] shares) public {
    let holders = [accounts[0], accounts[1], accounts[2]];
    let shares = [50, 30, 20];
    // let hash = await contract.songHash.call(songName, price, holders, shares);
    // // console.log(hash);
    let downloadInfo = "song_url password";
    let hash = await contract.getSongHash.call(songName, price, holders, shares);
    console.log("hash get: " + hash);
    let status = await contract.registerCopyright(hash, songName, downloadInfo, price, holders, shares);
    //
    // for (let e of status.logs) {
    //   if (e.event == "registerEvent") {
    //     hash = e.args.param
    //     console.log("Hash: " + hash);
    //   }
    // }

    let ret_url = await contract.getDownloadInfo.call(hash);
    console.log("return url: " + ret_url);

    let result = await contract.checkSongPrice.call(hash);
    console.log("the price get: " + result);
    assert.equal(price, result);
  });

  it("should return downloadInfo after purchase", async function () {
    const contract = await Copyright.deployed();
    let songID = "0x24a80a9a2d03f38eaf4c19fc10e3cf9eeb559654a74d411662f28367bcd6f1cf";
    let price = 1000;
    let status = await contract.buyLicense(songID, {value: price});
    let downloadInfo = "song_url password";
    let ret_val = await contract.getDownloadInfo.call(songID);
    console.log("return url: " + ret_val);
    assert.equal(ret_val, downloadInfo);
  });

  it("should return 0 for registered songs", async function () {
    const contract = await Copyright.deployed();

    let result = await contract.checkSongPrice.call("not registered fake song hehehe");
    console.log(result);
    assert.equal(result, 0);
  });


});
