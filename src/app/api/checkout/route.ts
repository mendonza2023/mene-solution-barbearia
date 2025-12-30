import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Configuração robusta do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // @ts-ignore - Ignora erro de versão caso haja conflito entre tipos e SDK
  apiVersion: '2024-12-18.acacia', 
});

export async function POST(req: Request) {
  try {
    const { servico, preco, agendamentoId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { 
              name: servico,
              description: 'Agendamento Mene Solution',
            },
            unit_amount: Math.round(preco * 100), // Garante número inteiro para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Certifique-se de que esta variável está no seu .env.local
      success_url: `${process.env.NEXT_PUBLIC_URL}/perfil?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/perfil?canceled=true`,
      metadata: { 
        agendamentoId: agendamentoId 
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });

  } catch (error: unknown) {
    // Tratamento de erro seguro para TypeScript
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro no Checkout:', message);
    
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}