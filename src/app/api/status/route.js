import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";
const MERCHANT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const merchantTransactionId = searchParams.get('id');

  const keyIndex = 1;
  const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  const option = {
    method: 'GET',
    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': MERCHANT_ID,
    },
  };

  try {
    const response = await axios.request(option);
    if (response.data.success === true) {
      return NextResponse.redirect(`/payment-success?authorized=true`);
    } else {
      return NextResponse.redirect(`/payment-failure?authorized=true`);
    }
  } catch (error) {
    console.error("error in payment status", {
      message: error.message,
      response: error.response ? error.response.data : null,
      request: error.request ? error.request : null,
    });
    return NextResponse.json({ error: 'Failed to fetch payment status', details: error.message }, { status: 500 });
  }
  
}
