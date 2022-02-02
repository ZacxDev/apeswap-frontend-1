import { Interface } from '@ethersproject/abi'
import { Contract } from 'web3-eth-contract'

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

type GroupLabelledCall = {
  label: string
  calls: Call[]
}

const multicall = async (multi: Contract, abi: any[], calls: Call[]) => {
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

export const groupLabelledMulticall = async (
  multi: Contract,
  abi: any[],
  calls: GroupLabelledCall[],
): Promise<Record<string, unknown>[]> => {
  const itf = new Interface(abi)

  const bp: Record<number, string> = {}
  calls.reduce((acc, c) => {
    const cl = c.calls.length
    if (cl === 0) {
      return acc
    }

    const t = acc + cl
    bp[t] = c.label
    return t
  }, 0)

  const callNames = calls.flatMap(l => l.calls.map(c => c.name))
  const callIndexes = calls.flatMap(l => l.calls.map((_c, i) => i))
  const calldata = calls.flatMap(
    l => l.calls.map(
      call => [
        call.address.toLowerCase(),
        itf.encodeFunctionData(call.name, call.params),
      ]
    )
  )
  const { returnData } = await multi.methods.aggregate(calldata).call()

  const res: Record<string, unknown>[] = []
  returnData.forEach((l, i) => {
    let nb = i+1
    let lbl = ''
    const thisCallName = callNames[i]
    const thisCallIndex = callIndexes[i]
    // find current breakpoint
    while (true) {
      const f = bp[nb]
      if (f !== undefined) {
        lbl = f
        break
      }
      if (nb >= returnData.length) {
        // TODO: this should never happen but we should log error (didn't find
        // breakpoint)
        break
      }
      nb++
    }

    if (res[lbl] === undefined) {
      res[lbl] = []
    }

    res[lbl][thisCallIndex] = itf.decodeFunctionResult(thisCallName, l)
  })

  return res
}

export default multicall
