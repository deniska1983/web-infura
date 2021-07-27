/* ====================================================================
 * NFT contract for testing
 * Simplified for testing, no ownership is claimed or checked
 * ==================================================================== */
pragma solidity ^0.4.22;


/// @dev ERC-721 NFT Standard
contract ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;
    function approve(address _approved, uint256 _tokenId) external;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}


// @title ERC-721 Non-Fungible Token Standard
interface ERC721TokenReceiver {
	function onERC721Received(address _from, uint256 _tokenId, bytes data) external returns(bytes4);
}


contract BitGuildTestToken is ERC721 {
    uint itemTotal = 1;

    mapping (uint256 => address) itemIdToOwner;

    /// @dev tokenIds owned by address (array)
    mapping (address => uint256[]) ownerToItemArray;

    /// @dev Equipment token ID search in owner array
    mapping (uint256 => uint256) itemIdToOwnerIndex;

    /// @dev The authorized address for each item
    mapping (uint256 => address) itemIdToApprovals;

    /// @dev The authorized operators for each address
    mapping (address => mapping (address => bool)) operatorToApprovals;

    /// @dev This emits when the approved address for an item is changed or reaffirmed.
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    /// @dev This emits when an operator is enabled or disabled for an owner.
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /// @dev This emits when the token ownership changed
    event Transfer(address indexed from, address indexed to, uint256 tokenId);

    /// @dev This emits when the token is created
    event CreateItem(address indexed owner, uint256 tokenId);

    // modifier
    /// @dev Check if token ID is valid
    modifier isValidToken(uint256 _tokenId) {
        require(_tokenId >= 1 && _tokenId <= itemTotal);
        require(itemIdToOwner[_tokenId] != address(0)); 
        _;
    }

    modifier canTransfer(uint256 _tokenId) {
        address owner = itemIdToOwner[_tokenId];
        require(msg.sender == owner || msg.sender == itemIdToApprovals[_tokenId] || operatorToApprovals[owner][msg.sender]);
        _;
    }
        
    function name() public pure returns(string) {
        return "BitGuild Test Token";
    }

    function symbol() public pure returns(string) {
        return "BGTEST";
    }

    /// @dev Search for token quantity address
    /// @param _owner Address that needs to be searched
    /// @return Returns token quantity
    function balanceOf(address _owner) external view returns(uint256) {
        require(_owner != address(0));
        return ownerToItemArray[_owner].length;
    }

    /// @dev Find the owner of an WAR
    /// @param _tokenId The tokenId of WAR
    /// @return Give The address of the owner of this WAR
    function ownerOf(uint256 _tokenId) external view /*isValidToken(_tokenId)*/ returns (address owner) {
        return itemIdToOwner[_tokenId];
    }

    /// @dev Transfers the ownership of an WAR from one address to another address
    /// @param _from The current owner of the WAR
    /// @param _to The new owner
    /// @param _tokenId The WAR to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) 
        external
    {
        _safeTransferFrom(_from, _to, _tokenId, data);
    }

    /// @dev Transfers the ownership of an WAR from one address to another address
    /// @param _from The current owner of the WAR
    /// @param _to The new owner
    /// @param _tokenId The WAR to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) 
        external
    {
        _safeTransferFrom(_from, _to, _tokenId, "");
    }

    /// @dev Transfer ownership of an WAR, '_to' must be a vaild address, or the WAR will lost
    /// @param _from The current owner of the WAR
    /// @param _to The new owner
    /// @param _tokenId The WAR to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId)
        external
        isValidToken(_tokenId)
        canTransfer(_tokenId)
    {
        address owner = itemIdToOwner[_tokenId];
        require(owner != address(0));
        require(_to != address(0));
        require(owner == _from);
        
        _transfer(_from, _to, _tokenId);
    }

    /// @dev Set or reaffirm the approved address for an WAR
    /// @param _approved The new approved WAR controller
    /// @param _tokenId The WAR to approve
    function approve(address _approved, uint256 _tokenId)
        external
    {
        address owner = itemIdToOwner[_tokenId];
        require(owner != address(0));
        require(msg.sender == owner || operatorToApprovals[owner][msg.sender]);

        itemIdToApprovals[_tokenId] = _approved;
        emit Approval(owner, _approved, _tokenId);
    }

    /// @dev Enable or disable approval for a third party ("operator") to manage all your asset.
    /// @param _operator Address to add to the set of authorized operators.
    /// @param _approved True if the operators is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) 
        external
    {
        operatorToApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @dev Get the approved address for a single WAR
    /// @param _tokenId The WAR to find the approved address for
    /// @return The approved address for this WAR, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view isValidToken(_tokenId) returns (address) {
        return itemIdToApprovals[_tokenId];
    }

    /// @dev Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the WARs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return operatorToApprovals[_owner][_operator];
    }

    /// @dev Count WARs tracked by this contract
    /// @return A count of valid WARs tracked by this contract, where each one of
    ///  them has an assigned and queryable owner not equal to the zero address
    function totalSupply() external view returns (uint256) {
        return itemTotal;
    }

    /// @dev Do the real transfer with out any condition checking
    /// @param _from The old owner of this token(If created: 0x0)
    /// @param _to The new owner of this token
    /// @param _tokenId The tokenId of the token
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        if (_from != address(0)) {
            uint256 indexFrom = itemIdToOwnerIndex[_tokenId];
            uint256[] storage fsArray = ownerToItemArray[_from];
            require(fsArray[indexFrom] == _tokenId);

            // If the token is not the element of array, change it to with the last
            if (indexFrom != fsArray.length - 1) {
                uint256 lastTokenId = fsArray[fsArray.length - 1];
                fsArray[indexFrom] = lastTokenId; 
                itemIdToOwnerIndex[lastTokenId] = indexFrom;
            }
            fsArray.length -= 1; 
            
            if (itemIdToApprovals[_tokenId] != address(0)) {
                delete itemIdToApprovals[_tokenId];
            }
        }

        // Give the token to '_to'
        itemIdToOwner[_tokenId] = _to;
        ownerToItemArray[_to].push(_tokenId);
        itemIdToOwnerIndex[_tokenId] = ownerToItemArray[_to].length - 1;
        
        emit Transfer(_from != address(0) ? _from : this, _to, _tokenId);
    }

    /// @dev Actually perform the safeTransferFrom
    function _safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) 
        internal
        isValidToken(_tokenId) 
        canTransfer(_tokenId)
    {
        address owner = itemIdToOwner[_tokenId];
        require(owner != address(0));
        require(_to != address(0));
        require(owner == _from);
        
        _transfer(_from, _to, _tokenId);

        // Do the callback after everything is done to avoid reentrancy attack
        uint256 codeSize;
        assembly { codeSize := extcodesize(_to) }
        if (codeSize == 0) {
            return;
        }
        bytes4 retval = ERC721TokenReceiver(_to).onERC721Received(_from, _tokenId, data);
        // bytes4(keccak256("onERC721Received(address,uint256,bytes)")) = 0xf0b9e5ba;
        require(retval == 0xf0b9e5ba);
    }

    //----------------------------------------------------------------------------------------------------------

    /// @dev Equipment creation
    /// @param _owner Owner of the equipment created
    /// @return Token ID of the equipment created
    function createItem(address _owner) 
        external 
        returns(uint256)
    {
        // require(actionContracts[msg.sender]);
        require(_owner != address(0));

        uint256 newItemId = itemTotal;
        require(newItemId < 4294967296);

        itemTotal++;
        
        _transfer(0, _owner, newItemId);
        emit CreateItem(_owner, newItemId);
        return newItemId;
    }

    /// @dev Get tokenIds and flags by owner
    function getOwnItems(address _owner) external view returns(uint256[] tokens) {
        require(_owner != address(0));
        uint256[] storage fsArray = ownerToItemArray[_owner];
        uint256 length = fsArray.length;
        tokens = new uint256[](length);
        for (uint256 i = 0; i < length; ++i) {
            tokens[i] = fsArray[i];
        }
    }
}
