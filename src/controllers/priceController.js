// controllers/priceController.js
import prisma from '../prisma.js';
import axios from 'axios';
import dayjs from 'dayjs';

// const purchasePriceUrl = `https://www.zohoapis.in/creator/v2.1/publish/agribusinesscorp/cvr/report/All_Daily_Purchase_Price_Commodities?privatelink=MSJQBGGGk05bWxw5CfBdkPOa3Xn5ztyPAhYr2991s6pM8041Mw4yZEFOvW5kwXnHGOQGg2ebZk1fWnn364BGMRpXnO5ZswxbQBre&Date_of_Price=08-May-2025&max_records=1000`;

// const salesPriceUrl = `https://www.zohoapis.in/creator/v2.1/publish/agribusinesscorp/cvr/report/Daily_Sales_Price_Item_Report?privatelink=g6tCOWHyNz45vZzyEX8tdvtSanXyajTJmmvrGrb15SNOOpvCqzgpakGKKS3u00bV5KvQ023ADG1dv2r5vnP2MZ3qvdezMV59N46R&Date_of_Price=08-May-2025&max_records=1000`;



export const storePurchasePrices = async (req, res) => {
  try {
    // 🗓️ Get the date from query params or fallback to today's date
    const inputDate = dayjs().format('DD-MM-YYYY');

    // 🔗 Construct API URL dynamically
    const purchasePriceUrl = `https://www.zohoapis.in/creator/v2.1/publish/agribusinesscorp/cvr/report/All_Daily_Purchase_Price_Commodities?privatelink=MSJQBGGGk05bWxw5CfBdkPOa3Xn5ztyPAhYr2991s6pM8041Mw4yZEFOvW5kwXnHGOQGg2ebZk1fWnn364BGMRpXnO5ZswxbQBre&Date_of_Price=${inputDate}&max_records=1000`;

    console.log('📡 Fetching purchase prices from:', purchasePriceUrl);

    const response = await axios.get(purchasePriceUrl, {
      headers: { Accept: 'application/json' },
      validateStatus: () => true
    });
    console.log('📥 Response received:', response);
    // ⚠️ If no records exist
    if (response.data?.code === 9220) {
      console.log(`⚠️ No data found for ${inputDate}`);
      return res.status(404).json({ message: `No data for ${inputDate}` });
    }

    const data = response.data?.data || [];

    // ✅ If no usable records returned
    if (data.length === 0) {
      console.log(`📭 Empty data array for ${inputDate}`);
      return res.status(404).json({ message: `No data for ${inputDate}` });
    }

    console.log(`📦 Found ${data.length} records for ${inputDate}`);

    for (const item of data) {
      const entry = {
        commodityNameId: item.Commodity_Name?.ID,
        dateOfPrice: new Date(item.Date_of_Price),
        commodityCode: item.Commodity_Code,
        commodityName: item.Commodity_Name?.Commodity_Name || 'Unknown',
        minPurchasePriceKg: parseFloat(item.MIN_Purchase_Price_KG),
        maxPurchasePriceKg: parseFloat(item.MAX_Purchase_Price_KG),
        minPmp: parseFloat(item.MIN_PMP),
        maxPmp: parseFloat(item.MAX_PMP),
        dailyPriceId: item.Daily_Purchase_Price_ID || {},
        dateField: item.Daily_Purchase_Price_ID?.Date_field
      };

      await prisma.purchasePrice.upsert({
            where: { commodityNameId: entry.commodityNameId },
        update: entry,
        create: entry,
      });
    }

    res.status(200).json({ message: `Stored ${data.length} records for ${inputDate}` });

  } catch (err) {
  console.error('❌ Error storing purchase prices:', {
    message: err.message,
    status: err.response?.status,
    responseData: err.response?.data,
    stack: err.stack
  });    
    res.status(500).json({ error: 'Failed to fetch and save purchase prices' });
  }
};

export const storeSalesPrices = async (req, res) => {
  try {
    // Get date from query or default to today
    const inputDate = dayjs().format('DD-MM-YYYY');

    // Construct dynamic URL
  const salesPriceUrl = `https://www.zohoapis.in/creator/v2.1/publish/agribusinesscorp/cvr/report/Daily_Sales_Price_Item_Report?privatelink=g6tCOWHyNz45vZzyEX8tdvtSanXyajTJmmvrGrb15SNOOpvCqzgpakGKKS3u00bV5KvQ023ADG1dv2r5vnP2MZ3qvdezMV59N46R&Date_of_Price=${inputDate}&max_records=1000`;

    console.log('📡 Fetching sales prices from:', salesPriceUrl);

    // Prevent axios from throwing on 400
    const response = await axios.get(salesPriceUrl, {
      headers: { Accept: 'application/json' },
      validateStatus: () => true
    });

    // Handle Zoho's "no data" response
    if (response.data?.code === 9220 || !Array.isArray(response.data?.data) || response.data.data.length === 0) {
      console.log(`⚠️ No sales price data found for ${inputDate}`);
      return res.status(404).json({ message: `No data for ${inputDate}` });
    }

    const data = response.data.data;
    console.log(`📦 Found ${data.length} sales price records`);

    for (const item of data) {
      const entry = {
        dateOfPrice: item.Date_of_Price,
        commodityCode: item.Commodity_Code1,
        commodityName: item.Commodity_Name1?.Name_To_Be_Printed || 'Unknown',
        pricePerKg: parseFloat(item.Price_Per_KG),
        siNo: item.SI_No,
        dailySalesPriceId: item.Daily_Sales_Price_ID || {},
        commodityNameId: item.Commodity_Name1?.ID,
      };

      // 🛡️ Make sure your schema has a unique constraint on commodityNameId + dateOfPrice
      await prisma.salesPrice.upsert({
            where: { commodityNameId: entry.commodityNameId },
        update: entry,
        create: entry
      });
    }

    res.status(200).json({ message: `Stored ${data.length} sales records for ${inputDate}` });

  } catch (err) {
    console.error('❌ Error storing sales prices:', {
      message: err.message,
      status: err.response?.status,
      responseData: err.response?.data,
      stack: err.stack
    });
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
