// controllers/priceController.js
import prisma from '../prisma.js';
import axios from 'axios';

const purchasePriceUrl = `https://www.zohoapis.in/creator/v2.1/publish/agribusinesscorp/cvr/report/All_Daily_Purchase_Price_Commodities?privatelink=MSJQBGGGk05bWxw5CfBdkPOa3Xn5ztyPAhYr2991s6pM8041Mw4yZEFOvW5kwXnHGOQGg2ebZk1fWnn364BGMRpXnO5ZswxbQBre&Date_of_Price=08-May-2025&max_records=1000`;

const salesPriceUrl = `https://www.zohoapis.in/creator/v2.1/publish/agribusinesscorp/cvr/report/Daily_Sales_Price_Item_Report?privatelink=g6tCOWHyNz45vZzyEX8tdvtSanXyajTJmmvrGrb15SNOOpvCqzgpakGKKS3u00bV5KvQ023ADG1dv2r5vnP2MZ3qvdezMV59N46R&Date_of_Price=08-May-2025&max_records=1000`;

export const storePurchasePrices = async (req, res) => {
    console.log('Fetching purchase prices from:', purchasePriceUrl);
  try {
    const response = await axios.get(purchasePriceUrl,{
  headers: {
    Accept: 'application/json'  // or 'text/csv' depending on what you expect
  }
});
    
    const data = response.data?.data || [];
    console.log('Fetching purchase prices from api:', response.data);

    const formatted = data.map(item => ({
      dateOfPrice: new Date(item.Date_of_Price),
      commodityCode: item.Commodity_Code,
      commodityName: item.Commodity_Name?.Commodity_Name || 'Unknown',
      minPurchasePriceKg: parseFloat(item.MIN_Purchase_Price_KG),
      maxPurchasePriceKg: parseFloat(item.MAX_Purchase_Price_KG),
      minPmp: parseFloat(item.MIN_PMP),
      maxPmp: parseFloat(item.MAX_PMP),
      dailyPriceId: item.Daily_Purchase_Price_ID || {}, // storing full object
      dateField:item.Daily_Purchase_Price_ID.Date_field

    }));

    await prisma.purchasePrice.createMany({
      data: formatted,
      skipDuplicates: true
    });

    res.status(201).json({ message: 'Purchase prices fetched and saved successfully' });
  } catch (err) {
    console.error('Error storing purchase prices:', err);
    res.status(500).json({ error: 'Failed to fetch and save purchase prices' });
  }
};

export const storeSalesPrices = async (req, res) => {
  try {
    const response = await axios.get(salesPriceUrl,{
  headers: {
    Accept: 'application/json'  // or 'text/csv' depending on what you expect
  }
});
    const data = response.data?.data || [];

    
    const formatted = data.map(item => ({
      dateOfPrice: item.Date_of_Price,
      commodityCode: item.Commodity_Code1,
      commodityName: item.Commodity_Name1?.Name_To_Be_Printed || 'Unknown',
      pricePerKg: parseFloat(item.Price_Per_KG),
      siNo: item.SI_No,
      dailySalesPriceId: item.Daily_Sales_Price_ID || {}, // storing full object
      commodityNameId: item.Commodity_Name1?.ID || 'Unknown',
    }));

    await prisma.salesPrice.createMany({
      data: formatted,
      skipDuplicates: true
    });

    res.status(201).json({ message: 'Sales prices fetched and saved successfully' });
  } catch (err) {
    console.error('Error storing sales prices:', err);
    res.status(500).json({ error: 'Failed to fetch and save sales prices' });
  }
};

export const getPurchasePrices = async (req, res) => {
  try {
    const data = await prisma.purchasePrice.findMany({
      orderBy: { dateOfPrice: 'desc' }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purchase prices' });
  }
};

export const getSalesPrices = async (req, res) => {
  try {
    const data = await prisma.salesPrice.findMany({
      orderBy: { dateOfPrice: 'desc' }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales prices' });
  }
};
