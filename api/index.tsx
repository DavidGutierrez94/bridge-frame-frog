import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

 


app.frame('/', (c) => {
  const { status } = c
  return c.res({
    action: '/finish',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {'Welcome to Frame Bridge'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter (ETH) or (USDC)" />,
      <Button.Transaction target='send-ether-base'>ETH-BASE</Button.Transaction>,
      <Button.Transaction target='send-ether-op'>ETH-OP</Button.Transaction>,
      <Button.Transaction target='send-usdc-base'>USDC-BASE</Button.Transaction>,
    ],
  })
})
app.frame('/finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    )
  })
})

app.transaction('/send-ether-op', (c) => {
  // Send transaction response.
  const { inputText } = c
  return c.send({
    chainId: 'eip155:10',
    to: '0x7777B6d990CC06c3e05D0Cbc152D1E0b80fa8Ab0',
    value: parseEther(inputText||'1'),
  })
})
app.transaction('/send-ether-base', (c) => {
  // Send transaction response.
  const { inputText } = c
  return c.send({
    chainId: 'eip155:10',
    to: '0x44f735bEDBC02A0abFb9e085eB4023d567b4f7D5',
    value: parseEther(inputText||'1'),
  })
})  
app.transaction('/send-usdc-base', (c) => {
  // Send transaction response.
  const { inputText } = c
  return c.send({
    chainId: 'eip155:10',
    to: '0xb0cc02A1A7a71A4bb902b33eD07c9203661359C3',
    value: parseEther(inputText||'1'),
  })
}) 

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
