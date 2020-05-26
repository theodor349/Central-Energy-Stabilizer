# Central-Energy-Stabilizer

## Setup ##
  - Clone the repository into a desired folder
  - Needed installs 
    - Node.js
    - npm or another packagemanager for .js (this guide uses npm)
    - MongoDB https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition
    
**Server setup:**
  - Open a commandline and navigate to ```.\Implementation\Server``` and use the command ```npm install```

**Water heater setup:**
  - Create a ```DeviceId.json``` file inside ```.\Implementation\Devices\WaterHeater```
    - In ```DeviceId.json``` write ```{"deviceId":"testId"}```
  - Open a commandline and navigate to ```.\Implementation\Devices\WaterHeater``` and use the command ```npm install```


**For setup with remote server:**
 - Create a ```DBConnectionString.js``` file inside ```.\Implementation\Server```
 - In ```DBConnectionString.js``` write ```module.exports = "insert connectionStringToRemoteMongoDBServer";```
 - Set the boolen ```shouldConnectToServer = true``` on line 32 in ```.\Implementation\Devices\WaterHeater\App.js```
 
 ## Startup ##

**MongoDB startup**
  - When MongoDB is installed use ```"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\data\db"``` in a commandline

**Server startup:**
 - Start the MongoDB server on ```mongodb://localhost:27017``` (the default)
 - Open a commandline, navigate to ```.\Implementation\Server``` and run ```node App.js```

**Water heater startup:**
 - Open a commandline, navigate to ```.\Implementation\Devices\WaterHeater``` and run ```node App.js```
  
