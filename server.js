const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("API running"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

/*

    emi_limit
    statement-email
    tell-me-customer-care-number
    loan
    loan-amount-due
    emi_card_details
    cibil_score
    change_bank_ac


*/
