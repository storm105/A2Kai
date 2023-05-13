/*
Name: Kai Yu Man
StudentID: 162280218
SenecaEmail: kman2@myseneca.ca
Date: Feb 5, 2023
Description: Assignment 2
Course: WEB322
Professor: Ms. Jenelle Chen
*/


// 1. import Express library

const express = require('express');
const app = express();


// 2. creating a port

const HTTP_PORT = process.env.PORT || 8080;

// defining a static assets folder (public folder)
app.use(express.static("./public"))  // self note: resources inside public folder is now accessible.

const path = require("path");


// middleware
// - extract data sent by <form> element in the client
app.use(express.urlencoded({ extended: true }));


// data store: my "temporary" database
// - An array to store license, hours, and payAmount of each car
const parkingArray = [];   // array


// endpoints 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.post("/parking-receipt", (req, res) =>{   // app.post to handle POST request  (the method in index.html)
    console.log("debug: Pay parking request received at /parking-receipt endpoint");
    
    let rate = 0;
    const taxRate = 0.13;

    // to be calculated
    let subTotal = 0;
    let payAmount = 0;  // for customer, pay amount tax-included

    console.log(req.body);

    const licenseInput = req.body.license;
    const lotInput = req.body.lot;
    const hoursInput = req.body.hours;

    const hours = parseInt(hoursInput); // convert string to int

    if(hours>=1 && hours<=8 ){
        if(lotInput==="A"){
            rate = 3;
        } else if(lotInput==="B"){
            rate = 10;
        } else {
            rate = 5;
        }
        subTotal = rate * hours;
        tax = subTotal * taxRate;
        payAmount = subTotal + tax;

        // create a single parking record:
        const carParked = {license: licenseInput, hour: hours, amount: payAmount};
        // add the single record to the array:
        parkingArray.push(carParked);

        console.log(`debug: num of parking records = ${parkingArray.length}`);

        // generate parking receipt using res.send, with html and js variables:
        res.send(`<h1>Your Parking Receipt</h1>
        <p>License Plate: ${licenseInput}</p>
        <p>Hours requested: ${hours}</p>
        <p>Hourly Rate: $${rate}</p>
        <p>Sub-total: $${subTotal.toFixed(2)}</p>
        <p>Tax: $${tax.toFixed(2)}</p>
        <h2>Total Amount: $${payAmount.toFixed(2)}</h2>
        <h3>Thank you for your payment!</h3>`);

    } else {
        return res.send(`<p style="color: blue; font-family:arial; font-size: 22px;">Sorry, the hours of parking should be in the range of 1 to 8. Please retry.</p>`)
    }
    
})

app.get("/admin", (req, res) =>{
    res.sendFile(path.join(__dirname, "admin.html"));
})

app.post("/login", (req, res) =>{

    const nameInput = req.body.username;
    const pwdInput = req.body.password;

    if(nameInput==="admin" && pwdInput==="0000"){
        
        let dailyAmount = 0;  // for admin use, total daily income 

        for(let i=0; i<parkingArray.length; i++){
            dailyAmount += parkingArray[i].amount;
        }

        // send result, with in-line styling
        res.send(`<h1 style="color: blue; font-family: arial; font-size: 26px;">Summary of the day:</h1>
                <p style="font-size: 20px;">Total cars parked: ${parkingArray.length}</p>
                <p style="font-size: 20px;">Total amount collected = $${dailyAmount.toFixed(2)}`);  

    } else {
        res.send(`<p style="color:red; font-family:arial; font-size: 22px;">Login failed. Please try again.</p>`);
    }
})


// 3. defining a function that will run when the server starts

const onHttpStart = () => {
    console.log(`Express web server is running on port ${HTTP_PORT}`);
    console.log(`press Ctrl+C to exit`);
}

// 4. app.listen() on the port & running that start function

app.listen(HTTP_PORT, onHttpStart);
