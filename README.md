# Central-Energy-Stabilizer

This project has been developed by a group of five Computer Science students at Aalborg University. This is a 2nd Semester Project.

WattsApp is an energy saving network bot that helps stabilizing the energy grid through the adjustment of connected devices. WattsApp helps schedule devices to turn on when there is surplus, so that they can be turned off when there is no surplus without having to use energy during the deficit period.

The first version of WattsApp includes one device: The water heater.

Further development of the program looks to include multiple devices, the first new device added being the washing machine.

## Installation ##
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
 
 ## Usage ##

**MongoDB startup:**
  - When MongoDB is installed use ```"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\data\db"``` in a commandline

**Server startup:**
 - Start the MongoDB server on ```mongodb://localhost:27017``` (the default)
 - Open a commandline, navigate to ```.\Implementation\Server``` and run ```node App.js```

**Water heater startup:**
 - Open a commandline, navigate to ```.\Implementation\Devices\WaterHeater``` and run ```node App.js```
  
## Dependencies ##
 - express V4.17.1
 - mongoose V5.9.
 - nodemon V2.0.2
 - socket.io V2.3.0
 - uuidv4 V6.0.7
 
**Development:**
 - assert V2.0.0
 - dotenv V8.2.0
 - mocha V7.1.1

## Folder Structure ##

In Root there exists three folders
  - Demo
    - Was a quick mock-up of the program and is now deprecated
  - Graphs 
    - Contains a single .ggb file which was used to create the API Demand and Production graphs
  - Implementation 
    - Contains all the code for the working application

### Implementation ###

Implementation is split into two folders 
  - Server 
  - Devices which connects to the server
    - At the moment in contains a water heater which works and a washing machine which does not

**Server:**  
Contains two folders
  - Public
    - Contains all resources accesseble by a user client
      - This includes: ```.js```, ```.css```, ```.html``` and ```.svg``` files
  - Test
    - Contains all the tests for the server
    
All the files that make up the server is located in root.

**Water Heater:**

Contains a folder for all its test.

All the files that make up the water heater is located in root.

