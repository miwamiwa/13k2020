let playerModel;
let monsterModel;
let aboutModel;
let nocolor="#0000"
let enemyhead=":=:=Febqfmnnqlsht`y^o`i*;<:HGsgn_j`a`cmkj*<<:JBW@v]j^ld*=<:JBW@vmnklg*>::JFGI^^^_`_*";
// enemy data
let edata={
  m:unpackModelMessage(enemyhead+"?=:TPwororsrxwvws*@=:OUrrwtvw*@<:STzxzzvyozrzrx*A=:OProwowsvwrxrs*B=:STwtrrrx*B<:STzxzzvyozrzrx*<<:NAPDRATCV@*;;:H@mhfifefbiakc*;=:ECfgfchcjbkghf"),
  r:unpackRigMessage("CK1iiagtbctdEB0I@0IC0FF0lc_lf`he^QN0tucQR0QN0tueQR0"),
  a:unpackAnimation("*still*Z]]]]Y]]]]*****\\I*XI*YIaQ***walk*F]]]]`Qh]]*****\\@*c@*W@*N@**attack*Fa]]]]RdXa*c<e>**S<]>*`<]>*W<^>*N<S>*d<_>*X<d>*o<j>*dash*R`]]]]PeQs*`F*^L*TL\\N*jL\\N*c@\\FWL^N*a@PF^L*k@fF*S@QFOL*c@sF^L"),
  c:[nocolor,"rgba(255,232,200,1.0)","rgba(177,91,0,1.0)","rgba(247,141,0,1.0)"]
}

let abdata={
  m:unpackModelMessage(":;:?Uiqcgkgsgmqsx*:=:GUEUhzbvc{GX*:=:IUKUnzuvs{IX*;<:KCplfmhf*;;:NCBCFBe_p^pbJ@KB*;:;IFGF*;:;FDhhkijg*;:;IDlinhmg"),
  r:unpackRigMessage("HK1ki^HF0"),
  a:unpackAnimation("*still*H]`**YA"),
  c:[nocolor,"rgba(157,95,194,1.0)","rgba(207,206,253,1.0)","rgba(232,255,79,1.0)"]
}

//abdata.a[0].animLength=32;

let fedata={
  m:unpackModelMessage(enemyhead+";;:H@mhfifefbiakc*;=:ECfgfchcjbkghf*?=:PEkdp_el`spnmkPI*@<:ANckgjgohuav_o*A=:?Dkbhallopgqgi?H*B<:JMnlfjkrmtqrrm"),
  r:unpackRigMessage("CK1jldcnbgiaEB0I@0IC0FF0lc_lf`he^OG0fncCK0@D0kneHK0"),
  a:unpackAnimation("*fly*Dj][]NGkYQ*f?**]?**Y?*e?*Y?*F?*Y?*atkfly*Di]\\]UH]V]*l?**P=S?]A*f=i<]A*N=J>XA*[?*f?*??*Z?*still*Zd]]]ZIj^O*fF**]OVQTW*bQfW*TFQOZQAW*GF*kF*\\F*KF"),
  c:edata.c
}

let pdata = {
  m:unpackModelMessage(":;:JFHF*;;:PAo^e^fffppnqf*<<:DQip`hmkqmqulv*<=:DQexjylv*=>:=H_ddcckdmaq`k*>=:?L_mciepjpfubo*?>:@Hdmaq`k_ddcck*@=:?L_mciepjpfubo*A=:TJvirktntqzswm*B;:SNUOTRzuyvvvSQ*C=:QKrkviwmzstqtn*D;:SNUOTRzuyvvv*;=:PCrhojpfnjlimfEB*B=:SNsoylxr*D=:SNsoylxr*@;:@REONTOSKPloiogp@O*@:<@RFNNS"),
  r:unpackRigMessage("HM1nm`jwdkp_hwffmbHG0HM0kj^>D0bma?J0>D0bmc?J0RI0vpeSM0RI0vpgSM0"),
  a:unpackAnimation("*run*L^]]S]WV^^f**ZC**C*SC*cC*]C*`C*eC*VC*]C*gethit*F]]]]]]]]]]]*U=*Z=_B**H=XB*U=OB*T=aB*U=RB*a=[B*g=bB*n=^B*_=iB*fall*RbZ]YZlSQ]W]*]CbK*[CUK*]K*QCWK*^K*kCiK*[C[K*NCRK*kCaK*LC[K*jC`K*nothing*R]\\]Z]Y]Z_[^**_E**]E*VE*\\E*WE*****shooting*F]]]]]_[]]]]*[<*X<**W<*L<*U<*T<*_<*[<*_<*"),
  c:[nocolor,"rgba(0,0,0,1.0)","rgba(255,154,33,1.0)","rgba(53,77,230,1.0)","rgba(240,112,0,1.0)"]
}
let loadModelData=()=>{
  /*
  playerModel = new CoolPath(0,0,
  ":;:CEhbnemiIIBI*:<:JFOGIH*:=:FEifkfkh*;>:ACcfcgdg*<<:IIIKOI*=;:JOodgcfgdicrdr*><:JMiojmnnlnknnolokomp*>;:IGltilij*?<:FIeleiijgjgjikgkgkil*?;:EDhhfpeg*@;:OGntgjji*A;:BHfdd`bk*B;:DCeocnee*C;:EQhlfkft*D;:FAjmhigd",
  "EG0jb^lk_@>0JJ0EO0he]fgdlhfGH0DE0JI1nj`kmapnbBA0ckeBC0DK0gtgEA0",
  "*walking*R]]]]dW]^]\\Z*Z;^>^D*_=]@*]HbL]O*\\D*[?fEYKgR*`?VEaKXR**`?`E_M*bEZM*Z?YE[M*XE^M*still*Z]]]]]]]]]]]*\\@_L[T**]@`C]K*\\@**]@\\P**`@`E]P*a@bE*X@XE\\P*X@YE",
  ["rgba(197,119,0,0.0)","rgba(58,0,121,1.0)","rgba(255,127,62,1.0)","#ffff","rgba(2,0,4,1.0)"]);
  */

  playerModel = new CoolPath(0,0,pdata);
  playerModel.selectAnimation(1);

  aboutModel=new CoolPath(0,0,abdata,2);

  aboutModel.selectAnimation(0);
}
