import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Configuração robusta do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // @ts-ignore - Ignora erro de versão caso haja conflito entre tipos e SDK
  apiVersion: '2024-12-18.acacia', 
});

// Exemplo de como deve estar a sua API de Checkout
export async function POST(req: Request) {
  try {
    const { servico, preco, cliente_nome, whatsapp, data_nascimento } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { 
            name: servico,
            description: `Cliente: ${cliente_nome} - Zap: ${whatsapp}` 
          },
          unit_amount: preco * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/perfil?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Erro Stripe:", error);
    return NextResponse.json({ error: "Falha ao gerar checkout" }, { status: 500 });
  }
}
  