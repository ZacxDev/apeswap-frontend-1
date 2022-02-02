import { Interface } from '@ethersproject/abi'
import { Contract } from 'web3-eth-contract'
import { Call } from '../multicall'

type LabelledGroupedCalls = {
  label: string
  calls: Call[]
}

const getGroupedMulticallsBreakpointIndexLabelMap = (
  calls: LabelledGroupedCalls[],
): Record<number, string> => {
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

  return bp
}

const getGroupedMulticallsBreakpointIndexLabelDecoderFn = (
  bp: Record<number, string>,
): (a: number, b: number) => string | null => {
  const fn = (
    currentBreakpointIx: number,
    maxIx: number,
  ): string | null => {
    const f = bp[currentBreakpointIx]
    if (f !== undefined) {
      return f
    }
    if (currentBreakpointIx >= maxIx) {
      // TODO: this should never happen but we should log error (didn't find
      // breakpoint)
      return null
    }

    return fn(currentBreakpointIx + 1, maxIx)
  }

  return fn
}

const groupedMulticallsToNameIndexTuple = (
  calls: LabelledGroupedCalls[],
): [string[], number[]] => {
  const names = calls.flatMap(l => l.calls.map(c => c.name))
  const ixs = calls.flatMap(l => l.calls.map((_c, i) => i))
  return [names, ixs]
}

const serializeGroupedMulticallsForInterface = (
  calls: LabelledGroupedCalls[],
  itf: Interface,
): unknown => {
  return calls.flatMap(
    l => l.calls.map(
      call => [
        call.address.toLowerCase(),
        itf.encodeFunctionData(call.name, call.params),
      ]
    )
  )
}

const deserializeReturnData = (
  data: string,
  ix: number,
  callNames: string[],
  itf: Interface,
) => {
  const thisCallName = callNames[ix]
  return itf.decodeFunctionResult(thisCallName, data)
}

const labelledGroupMulticall = async (
  multi: Contract,
  abi: any[],
  calls: LabelledGroupedCalls[],
): Promise<Record<string, unknown>[]> => {
  const itf = new Interface(abi)

  const bp = getGroupedMulticallsBreakpointIndexLabelMap(calls)
  const getLabelForResponseIndex = getGroupedMulticallsBreakpointIndexLabelDecoderFn(bp)

  const [callNames, callIndexes] = groupedMulticallsToNameIndexTuple(calls)
  const calldata = serializeGroupedMulticallsForInterface(calls, itf)

  const { returnData } = await multi.methods.aggregate(calldata).call()
  const dataLen = returnData.length

  const res: Record<string, unknown>[] = []
  returnData.forEach((l: string, i: number) => {
    // plus one because breakpoints are 1-indexed
    const nb = i + 1;
    const lbl = getLabelForResponseIndex(nb, dataLen)
    const thisCallIndex = callIndexes[i];

    if (res[lbl] === undefined) {
      res[lbl] = []
    }

    res[lbl][thisCallIndex] = deserializeReturnData(l, i, callNames, itf)
  })

  return res
}

export default labelledGroupMulticall
