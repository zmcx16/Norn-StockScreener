export const COOKIE_KEY_FACTOR_PANNEL = 'factor_pannel'

export const PeerTemplate = {
  tactics: [
    {
      type: "PEP",
      displayName: "P/E Peer",
      color: {
        main: { backgroundColor: '#f44336', color: '#fff' },     // Shade: 500
        avatar: { backgroundColor: '#d32f2f', color: '#fff' },   // Shade: 700
      },
      enable: true,
      flag: -1,
    },
    {
      type: "FwdPEP",
      displayName: "Fwd P/E Peer",
      color: {
        main: { backgroundColor: '#2196f3', color: '#fff' },
        avatar: { backgroundColor: '#1976d2', color: '#fff' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "PEGP",
      displayName: "PEG Peer",
      color: {
        main: { backgroundColor: '#4caf50', color: '#fff' },
        avatar: { backgroundColor: '#388e3c', color: '#fff' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "PSP",
      displayName: "P/S Peer",
      color: {
        main: { backgroundColor: '#ff9800', color: '#fff' },
        avatar: { backgroundColor: '#f57c00', color: '#fff' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "PBP",
      displayName: "P/B Peer",
      color: {
        main: { backgroundColor: '#9c27b0', color: '#fff' },
        avatar: { backgroundColor: '#7b1fa2', color: '#fff' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "PCP",
      displayName: "P/C Peer",
      color: {
        main: { backgroundColor: '#ffeb3b', color: 'rgba(0, 0, 0, 0.87)' },
        avatar: { backgroundColor: '#fbc02d', color: 'rgba(0, 0, 0, 0.87)' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "PFCFP",
      displayName: "P/FCF Peer",
      color: {
        main: { backgroundColor: '#00bcd4', color: '#fff' },
        avatar: { backgroundColor: '#0097a7', color: '#fff' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "DividendP",
      displayName: "Dividend Peer",
      color: {
        main: { backgroundColor: '#795548', color: '#fff' },
        avatar: { backgroundColor: '#5d4037', color: '#fff' },
      },
      enable: true,
      flag: 1,
    },
    {
      type: "FloatShortP",
      displayName: "Float Short Peer",
      color: {
        main: { backgroundColor: '#607d8b', color: '#fff' },
        avatar: { backgroundColor: '#455a64', color: '#fff' },
      },
      enable: true,
      flag: -1,
    },
    {
      type: "RecomP",
      displayName: "Recom Peer",
      color: {
        main: { backgroundColor: '#ff5722', color: '#fff' },
        avatar: { backgroundColor: '#e64a19', color: '#fff' },
      },
      enable: true,
      flag: -1,
    }
  ]
}

export const GetPeerTemplateDict = () => {
  let ret = {}
  PeerTemplate.tactics.forEach((element)=>{
    ret[element.type] = element
  })
  return ret
}