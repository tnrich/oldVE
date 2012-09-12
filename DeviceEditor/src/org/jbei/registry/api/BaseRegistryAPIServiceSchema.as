package org.jbei.registry.api
{
	 import mx.rpc.xml.Schema
	 public class BaseRegistryAPIServiceSchema
	{
		 public var schemas:Array = new Array();
		 public var targetNamespaces:Array = new Array();
		 public function BaseRegistryAPIServiceSchema():void
		{
			 var xsdXML0:XML = <xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ns1="http://cxf.apache.org/bindings/xformat" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="https://api.registry.jbei.org/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:xs="http://www.w3.org/2001/XMLSchema" attributeFormDefault="unqualified" elementFormDefault="unqualified" targetNamespace="https://api.registry.jbei.org/">
    <xsd:element name="blastn" type="tns:blastn"/>
    <xsd:element name="blastnResponse" type="tns:blastnResponse"/>
    <xsd:element name="createPart" type="tns:createPart"/>
    <xsd:element name="createPartResponse" type="tns:createPartResponse"/>
    <xsd:element name="createPlasmid" type="tns:createPlasmid"/>
    <xsd:element name="createPlasmidResponse" type="tns:createPlasmidResponse"/>
    <xsd:element name="createSequence" type="tns:createSequence"/>
    <xsd:element name="createSequenceResponse" type="tns:createSequenceResponse"/>
    <xsd:element name="createStrain" type="tns:createStrain"/>
    <xsd:element name="createStrainResponse" type="tns:createStrainResponse"/>
    <xsd:element name="entry" type="tns:entry"/>
    <xsd:element name="featuredDNASequence" type="tns:featuredDNASequence"/>
    <xsd:element name="getByPartNumber" type="tns:getByPartNumber"/>
    <xsd:element name="getByPartNumberResponse" type="tns:getByPartNumberResponse"/>
    <xsd:element name="getByRecordId" type="tns:getByRecordId"/>
    <xsd:element name="getByRecordIdResponse" type="tns:getByRecordIdResponse"/>
    <xsd:element name="getFastaSequence" type="tns:getFastaSequence"/>
    <xsd:element name="getFastaSequenceResponse" type="tns:getFastaSequenceResponse"/>
    <xsd:element name="getGenBankSequence" type="tns:getGenBankSequence"/>
    <xsd:element name="getGenBankSequenceResponse" type="tns:getGenBankSequenceResponse"/>
    <xsd:element name="getNumberOfPublicEntries" type="tns:getNumberOfPublicEntries"/>
    <xsd:element name="getNumberOfPublicEntriesResponse" type="tns:getNumberOfPublicEntriesResponse"/>
    <xsd:element name="getOriginalGenBankSequence" type="tns:getOriginalGenBankSequence"/>
    <xsd:element name="getOriginalGenBankSequenceResponse" type="tns:getOriginalGenBankSequenceResponse"/>
    <xsd:element name="getSequence" type="tns:getSequence"/>
    <xsd:element name="getSequenceResponse" type="tns:getSequenceResponse"/>
    <xsd:element name="hasReadPermissions" type="tns:hasReadPermissions"/>
    <xsd:element name="hasReadPermissionsResponse" type="tns:hasReadPermissionsResponse"/>
    <xsd:element name="hasWritePermissions" type="tns:hasWritePermissions"/>
    <xsd:element name="hasWritePermissionsResponse" type="tns:hasWritePermissionsResponse"/>
    <xsd:element name="isAuthenticated" type="tns:isAuthenticated"/>
    <xsd:element name="isAuthenticatedResponse" type="tns:isAuthenticatedResponse"/>
    <xsd:element name="login" type="tns:login"/>
    <xsd:element name="loginResponse" type="tns:loginResponse"/>
    <xsd:element name="logout" type="tns:logout"/>
    <xsd:element name="logoutResponse" type="tns:logoutResponse"/>
    <xsd:element name="removeEntry" type="tns:removeEntry"/>
    <xsd:element name="removeEntryResponse" type="tns:removeEntryResponse"/>
    <xsd:element name="removeSequence" type="tns:removeSequence"/>
    <xsd:element name="removeSequenceResponse" type="tns:removeSequenceResponse"/>
    <xsd:element name="search" type="tns:search"/>
    <xsd:element name="searchResponse" type="tns:searchResponse"/>
    <xsd:element name="tblastx" type="tns:tblastx"/>
    <xsd:element name="tblastxResponse" type="tns:tblastxResponse"/>
    <xsd:element name="updatePart" type="tns:updatePart"/>
    <xsd:element name="updatePartResponse" type="tns:updatePartResponse"/>
    <xsd:element name="updatePlasmid" type="tns:updatePlasmid"/>
    <xsd:element name="updatePlasmidResponse" type="tns:updatePlasmidResponse"/>
    <xsd:element name="updateStrain" type="tns:updateStrain"/>
    <xsd:element name="updateStrainResponse" type="tns:updateStrainResponse"/>
    <xsd:element name="uploadSequence" type="tns:uploadSequence"/>
    <xsd:element name="uploadSequenceResponse" type="tns:uploadSequenceResponse"/>
    <xsd:complexType name="getGenBankSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getGenBankSequenceResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="hasReadPermissions">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="hasReadPermissionsResponse">
        <xsd:sequence>
            <xsd:element name="return" type="xs:boolean"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getOriginalGenBankSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getOriginalGenBankSequenceResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="updatePlasmid">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="plasmid" type="tns:plasmid"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="plasmid">
        <xsd:complexContent>
            <xsd:extension base="tns:entry">
                <xsd:sequence>
                    <xsd:element minOccurs="0" name="backbone" type="xs:string"/>
                    <xsd:element name="circular" type="xs:boolean"/>
                    <xsd:element minOccurs="0" name="originOfReplication" type="xs:string"/>
                    <xsd:element minOccurs="0" name="promoters" type="xs:string"/>
                </xsd:sequence>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
    <xsd:complexType name="entry">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="alias" type="xs:string"/>
            <xsd:element minOccurs="0" name="bioSafetyLevel" type="xs:int"/>
            <xsd:element minOccurs="0" name="creator" type="xs:string"/>
            <xsd:element minOccurs="0" name="creatorEmail" type="xs:string"/>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="entryFundingSources" nillable="true" type="tns:entryFundingSource"/>
            <xsd:element minOccurs="0" name="intellectualProperty" type="xs:string"/>
            <xsd:element minOccurs="0" name="keywords" type="xs:string"/>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="links" nillable="true" type="tns:link"/>
            <xsd:element minOccurs="0" name="longDescription" type="xs:string"/>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="names" nillable="true" type="tns:name"/>
            <xsd:element minOccurs="0" name="owner" type="xs:string"/>
            <xsd:element minOccurs="0" name="ownerEmail" type="xs:string"/>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="partNumbers" nillable="true" type="tns:partNumber"/>
            <xsd:element minOccurs="0" name="recordId" type="xs:string"/>
            <xsd:element minOccurs="0" name="references" type="xs:string"/>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="selectionMarkers" nillable="true" type="tns:selectionMarker"/>
            <xsd:element minOccurs="0" name="shortDescription" type="xs:string"/>
            <xsd:element minOccurs="0" name="status" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="entryFundingSource">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="fundingSource" type="tns:fundingSource"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="fundingSource">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="fundingSource" type="xs:string"/>
            <xsd:element minOccurs="0" name="principalInvestigator" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="link">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="link" type="xs:string"/>
            <xsd:element minOccurs="0" name="url" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="name">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="name" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="partNumber">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="partNumber" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="selectionMarker">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="name" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="updatePlasmidResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:plasmid"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="uploadSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
            <xsd:element minOccurs="0" name="sequence" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="uploadSequenceResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:featuredDNASequence"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="featuredDNASequence">
        <xsd:complexContent>
            <xsd:extension base="tns:simpleDNASequence">
                <xsd:sequence>
                    <xsd:element minOccurs="0" name="accessionNumber" type="xs:string"/>
                    <xsd:element maxOccurs="unbounded" minOccurs="0" name="features" nillable="true" type="tns:dnaFeature"/>
                    <xsd:element minOccurs="0" name="identifier" type="xs:string"/>
                </xsd:sequence>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
    <xsd:complexType name="simpleDNASequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sequence" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="dnaFeature">
        <xsd:sequence>
            <xsd:element name="end" type="xs:int"/>
            <xsd:element minOccurs="0" name="name" type="xs:string"/>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="notes" nillable="true" type="tns:dnaFeatureNote"/>
            <xsd:element name="start" type="xs:int"/>
            <xsd:element name="strand" type="xs:int"/>
            <xsd:element minOccurs="0" name="type" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="dnaFeatureNote">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="name" type="xs:string"/>
            <xsd:element minOccurs="0" name="value" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getFastaSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getFastaSequenceResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="hasWritePermissions">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="hasWritePermissionsResponse">
        <xsd:sequence>
            <xsd:element name="return" type="xs:boolean"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="createPlasmid">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="plasmid" type="tns:plasmid"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="createPlasmidResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:plasmid"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="isAuthenticated">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="isAuthenticatedResponse">
        <xsd:sequence>
            <xsd:element name="return" type="xs:boolean"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getSequenceResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:featuredDNASequence"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="logout">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="logoutResponse">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:complexType name="getNumberOfPublicEntries">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:complexType name="getNumberOfPublicEntriesResponse">
        <xsd:sequence>
            <xsd:element name="return" type="xs:int"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="removeEntry">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="removeEntryResponse">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:complexType name="updateStrain">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="strain" type="tns:strain"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="strain">
        <xsd:complexContent>
            <xsd:extension base="tns:entry">
                <xsd:sequence>
                    <xsd:element minOccurs="0" name="genotypePhenotype" type="xs:string"/>
                    <xsd:element minOccurs="0" name="host" type="xs:string"/>
                    <xsd:element minOccurs="0" name="plasmids" type="xs:string"/>
                </xsd:sequence>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
    <xsd:complexType name="updateStrainResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:strain"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="login">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="login" type="xs:string"/>
            <xsd:element minOccurs="0" name="password" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="loginResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getByPartNumber">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="partNumber" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getByPartNumberResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:entry"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="createStrain">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="strain" type="tns:strain"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="createStrainResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:strain"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="search">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="query" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="searchResponse">
        <xsd:sequence>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="return" type="tns:searchResult"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="searchResult">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="entry" type="tns:entry"/>
            <xsd:element name="score" type="xs:float"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="arrayList">
        <xsd:complexContent>
            <xsd:extension base="tns:abstractList">
                <xsd:sequence/>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
    <xsd:complexType abstract="true" name="abstractList">
        <xsd:complexContent>
            <xsd:extension base="tns:abstractCollection">
                <xsd:sequence/>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
    <xsd:complexType abstract="true" name="abstractCollection">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:complexType name="createPart">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="part" type="tns:part"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="part">
        <xsd:complexContent>
            <xsd:extension base="tns:entry">
                <xsd:sequence>
                    <xsd:element minOccurs="0" name="packageFormat" type="xs:string"/>
                    <xsd:element minOccurs="0" name="pkgdDnaFwdHash" type="xs:string"/>
                    <xsd:element minOccurs="0" name="pkgdDnaRevHash" type="xs:string"/>
                </xsd:sequence>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
    <xsd:complexType name="createPartResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:part"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="createSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
            <xsd:element minOccurs="0" name="sequence" type="tns:featuredDNASequence"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="createSequenceResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:featuredDNASequence"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="tblastx">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="querySequence" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="tblastxResponse">
        <xsd:sequence>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="return" type="tns:blastResult"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="blastResult">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="alignmentLength" type="xs:int"/>
            <xsd:element minOccurs="0" name="bitScore" type="xs:float"/>
            <xsd:element minOccurs="0" name="entry" type="tns:entry"/>
            <xsd:element minOccurs="0" name="gapOpenings" type="xs:int"/>
            <xsd:element minOccurs="0" name="mismatches" type="xs:int"/>
            <xsd:element minOccurs="0" name="percentId" type="xs:float"/>
            <xsd:element minOccurs="0" name="queryId" type="xs:string"/>
            <xsd:element name="relativeScore" type="xs:float"/>
            <xsd:element name="score" type="xs:float"/>
            <xsd:element minOccurs="0" name="subjectId" type="xs:string"/>
            <xsd:element minOccurs="0" name="eValue" type="xs:float"/>
            <xsd:element minOccurs="0" name="qEnd" type="xs:int"/>
            <xsd:element minOccurs="0" name="qStart" type="xs:int"/>
            <xsd:element minOccurs="0" name="sEnd" type="xs:int"/>
            <xsd:element minOccurs="0" name="sStart" type="xs:int"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="removeSequence">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="removeSequenceResponse">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:complexType name="blastn">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="querySequence" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="blastnResponse">
        <xsd:sequence>
            <xsd:element maxOccurs="unbounded" minOccurs="0" name="return" type="tns:blastResult"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="updatePart">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="part" type="tns:part"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="updatePartResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:part"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getByRecordId">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="sessionId" type="xs:string"/>
            <xsd:element minOccurs="0" name="entryId" type="xs:string"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:complexType name="getByRecordIdResponse">
        <xsd:sequence>
            <xsd:element minOccurs="0" name="return" type="tns:entry"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:element name="ServiceException" type="tns:ServiceException"/>
    <xsd:complexType name="ServiceException">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:element name="SessionException" type="tns:SessionException"/>
    <xsd:complexType name="SessionException">
        <xsd:sequence/>
    </xsd:complexType>
    <xsd:element name="ServicePermissionException" type="tns:ServicePermissionException"/>
    <xsd:complexType name="ServicePermissionException">
        <xsd:sequence/>
    </xsd:complexType>
</xsd:schema>
;
			 var xsdSchema0:Schema = new Schema(xsdXML0);
			schemas.push(xsdSchema0);
			targetNamespaces.push(new Namespace('','https://api.registry.jbei.org/'));
		}
	}
}