import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";
const MERCHANT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const redirectUrl = "http://localhost:3000/api/status";

export async function POST(request) {
  const { name, mobileNumber, amount } = await request.json();
  const orderId = uuidv4();

  const paymentPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: name,
    mobileNumber: mobileNumber,
    amount: amount * 100,
    merchantTransactionId: orderId,
    redirectUrl: `${redirectUrl}/?id=${orderId}`,
    redirectMode: 'POST',
    paymentInstrument: { type: 'PAY_PAGE' },
  };

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
  const keyIndex = 1;
  const string = payload + '/pg/v1/pay' + MERCHANT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  const option = {
    method: 'POST',
    url: MERCHANT_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
    },
    data: { request: payload },
  };

  try {
    const response = await axios.request(option);
    return NextResponse.json({ msg: "OK", url: response.data.data.instrumentResponse.redirectInfo.url });
  } catch (error) {
    console.error("error in payment", error);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}
