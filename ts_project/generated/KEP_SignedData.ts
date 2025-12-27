
import { KEP_CMSVersion } from "./KEP_CMSVersion";
import { KEP_DigestAlgorithmIdentifiers } from "./KEP_DigestAlgorithmIdentifiers";
import { KEP_EncapsulatedContentInfo } from "./KEP_EncapsulatedContentInfo";
import { KEP_CertificateSet } from "./KEP_CertificateSet";
import { KEP_RevocationInfoChoices } from "./KEP_RevocationInfoChoices";
import { KEP_SignerInfos } from "./KEP_SignerInfos";

export interface KEP_SignedData {
  version: KEP_CMSVersion;
  digestalgorithms: KEP_DigestAlgorithmIdentifiers;
  encapcontentinfo: KEP_EncapsulatedContentInfo;
  certificates?: KEP_CertificateSet;
  crls?: KEP_RevocationInfoChoices;
  signerinfos: KEP_SignerInfos;
}
