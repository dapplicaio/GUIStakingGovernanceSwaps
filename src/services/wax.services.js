import axios from 'axios';
import { ATOMIC_ASSETS_CONTRACT, GAME_CONTRACT } from '../constants/wax.constants';
import {
  fetchRows, signTransaction,
} from '../helpers';

// Fetch resources
export const fetchResources = async ({ activeUser }) => {
  const { rows } = await fetchRows({
    contract: GAME_CONTRACT,
    scope: activeUser.accountName,
    table: "resources"
  });

  if (!rows[0]) {
    return [
      { resource_name: 'stone', amount: 0 },
      { resource_name: 'wood', amount: 0 },
      { resource_name: 'food', amount: 0 },
      { resource_name: 'gems', amount: 0 }
    ];
  }


  // Перевірка, чи всі ресурси присутні у відповіді, додавши недостаючі ресурси зі значеннями 0
  const resourceNames = rows.map(row => row.resource_name);
  const missingResources = [
    { resource_name: 'stone', amount: 0 },
    { resource_name: 'wood', amount: 0 },
    { resource_name: 'food', amount: 0 },
    { resource_name: 'gems', amount: 0 }
  ].filter(resource => !resourceNames.includes(resource.resource_name));

  return [...rows, ...missingResources];
};

// Fetch stats
export const fetchStats = async ({ activeUser }) => {
  const { rows } = await fetchRows({
    contract: GAME_CONTRACT,
    scope: activeUser.accountName,
    table: "stats"
  });

  return rows;
}

// Fetch GAME balance
export const fetchBalance = async ({activeUser}) => {
  const { rows } = await fetchRows({
    contract: 'dappgamemine',
    scope: 'dappgamemine',
    table: "balance"
  });

  if (!rows) {
    return [];
  }

  let userBalance = rows.find(row => row.owner === activeUser.accountName);


  return userBalance;
}

// Fetch EOSIO.TOKEN balance
export const fetchWaxBalance = async ({activeUser}) => {
  const { rows } = await fetchRows({
    contract: 'eosio.token',
    scope: activeUser.accountName,
    table: "accounts"
  });

  if (!rows) {
    return [];
  }

  return rows[0];
}

// Voting info (voting_name)
export const fetchVotingInfo = async () => {
  const { rows } = await fetchRows({
    contract: 'dappgamemine',
    scope: 'dappgamemine',
    table: "vtsinfo"
  });

  return rows;
}


export const leaderboadrTable = async (scope) => {
  const { rows } = await fetchRows({
    contract: "dappgamemine",
    scope,
    table: "lboards"
  });

  return rows;
}

// Fetch avatars
export const fetchAvatars = async ({ activeUser }) => {
  const { rows } = await fetchRows({
    contract: GAME_CONTRACT,
    scope: GAME_CONTRACT,
    table: "avatarsc"
  });

  let findUserAvatar = rows.find((row) => row.owner === activeUser.accountName);

  return findUserAvatar;
}

// resourcecost
export const resourceСost = async () => {
  const { rows } = await fetchRows({
    contract: 'dappgamemine',
    scope: 'dappgamemine',
    table: "resourcecost"
  });

  return rows;
}

// votes options
export const fetchVoteOptions = async ({ vote_name }) => {
  const { rows } = await fetchRows({
    contract: 'dappgamemine',
    scope: vote_name,
    table: "genvtngs"
  });

  return rows;
}

// changeration
export const changeRation = async () => {
  const { rows } = await fetchRows({
    contract: 'dappgamemine',
    scope: 'dappgamemine',
    table: "changeration"
  });
  return rows;
}

// qusets
export const fetchQuests = async () => {
  const { rows } = await fetchRows({
    contract: 'dappgamemine',
    scope: 'dappgamemine',
    table: "questst"
  });

  return rows;
}


// Fetch blends
export const fetchBlends = async () => {
  const { rows } = await fetchRows({
    contract: GAME_CONTRACT,
    scope: GAME_CONTRACT,
    table: "blendrecipes"
  });

  const templateOneRequests = rows.map(row => axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=minersgamers&template_id=${row.blend_components}`));

  const responsesOne = await Promise.all(templateOneRequests);


  const templateTwoRequests = rows.map(row => axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=minersgamers&template_id=${row.resulting_item}`));

  const responsesTwo = await Promise.all(templateTwoRequests);

  const updatedRows = rows.map((row, index) => {
    const { data: dataOne } = responsesOne[index];
    const { data: dataTwo } = responsesTwo[index];
    return { ...row, blend_components: dataOne.data, resulting_item: dataTwo.data[0] };
  })

  return updatedRows;
}


// Fetch staked farm items
export const fetchStakedItems = async ({ activeUser }) => {
  try {
    const { rows } = await fetchRows({
      contract: GAME_CONTRACT,
      scope: activeUser?.accountName,
      table: "staked"
    });

    if (!rows.length) return [];


    const assetRequests = rows.map(row =>
      axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/assets?asset_id=${row.asset_id}`)
    );

    const responses = await Promise.all(assetRequests);

    console.log(responses);

    const updatedRows = rows.map((row, index) => {
      const assetDataOne = responses[index].data.data[0];
      return { ...row, asset_id: assetDataOne };
    });

    console.log(updatedRows);

    return updatedRows;
  } catch (error) {
    console.error("Error fetching staked items:", error);
    return []; // Return empty array in case of error
  }
};



// Fetch user farmassets
export const fetchUserAsset = async ({ activeUser }) => {
  try {
    const allUserAssetsByCollection = await axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/assets?owner=${activeUser.accountName}&collection_name=minersgamers&schema_name=farmableitem`);
    return allUserAssetsByCollection.data.data;
  } catch (error) {
    console.error('Error fetching user assets:', error);
    return []; // Return an empty array in case of an error
  }
};

// Fetch user avatars
export const fetchUserAvatar = async ({ activeUser }) => {
  try {
    const allUserAssetsByCollection = await axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/assets?owner=${activeUser.accountName}&collection_name=minersgamers&schema_name=avatar`);
    console.log(allUserAssetsByCollection);
    return allUserAssetsByCollection.data.data;
  } catch (error) {
    console.error('Error fetching user assets:', error);
    return []; // Return an empty array in case of an error
  }
};

// Fetch user assets
export const fetchUserToolAsset = async ({ activeUser }) => {
  try {
    const allUserAssetsByCollection = await axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/assets?owner=${activeUser.accountName}&collection_name=minersgamers&schema_name=farmingitem`);
    console.log(allUserAssetsByCollection);
    return allUserAssetsByCollection.data.data;
  } catch (error) {
    console.error('Error fetching user assets:', error);
    return [];
  }
};


// Claim
export const claimRes = async ({ activeUser }) => {
  return await signTransaction({
    activeUser,
    account: GAME_CONTRACT,
    action: 'claim',
    data: {
      owner: activeUser.accountName,
      farmingitem: 1,
    },
  });
};

// Stake farming item
export const stakeWp = async ({ activeUser, selectedWP }) => {
  console.log(activeUser, selectedWP);
  return await signTransaction({
    activeUser,
    account: ATOMIC_ASSETS_CONTRACT,
    action: 'transfer',
    data: {
      from: activeUser.accountName,
      to: GAME_CONTRACT,
      asset_ids: selectedWP.map((item) => item.asset_id),
      memo: `stake farming item`
    }
  });
};

// Stake farming item
export const unstakeTool = async ({ activeUser, wpId }) => {
  console.log(activeUser, wpId);
};

// Stake item
export const stakeTool = async ({ activeUser, selectTool, wpId }) => {
  return await signTransaction({
    activeUser,
    account: 'atomicassets',
    action: 'transfer',
    data: {
      from: activeUser.accountName,
      to: GAME_CONTRACT,
      asset_ids: [selectTool],
      memo: `stake items:${wpId}`
    }
  });
};

// blend items
export const blend = async ({ activeUser, componentIds, id }) => {

  console.log(activeUser, componentIds, id);
  return await signTransaction({
    activeUser,
    account: ATOMIC_ASSETS_CONTRACT,
    action: 'transfer',
    data: {
      from: activeUser.accountName,
      to: GAME_CONTRACT,
      asset_ids: componentIds.map((item) => item.asset_id),
      memo: `blend:${id}`
    }
  });
};

// Upgrade tool
export const upgradeTool = async ({ activeUser, toolID, wpID }) => {
  const maxLevel = toolID.data.maxLevel;
  const currentLevel = toolID.data.level;

  const nextLvl = currentLevel + 1;

  if (nextLvl > maxLevel) {
    throw new Error('Error: The next level exceeds the maximum level of the instrument.');
  }

  return await signTransaction({
    activeUser,
    account: GAME_CONTRACT,
    action: 'upgradeitem',
    data: {
      owner: activeUser.accountName,
      item_to_upgrade: toolID.asset_id,
      next_level: nextLvl,
      staked_at_farmingitem: wpID
    }
  });
};


// Upgrade workplace
export const upgradeWorkplace = async ({ activeUser, wpID, stakedBool }) => {
  return await signTransaction({
    activeUser,
    account: GAME_CONTRACT,
    action: 'upgfarmitem',
    data: {
      owner: activeUser.accountName,
      farmingitem_to_upgrade: wpID,
      staked: stakedBool,
    }
  });
};

// Set avatar
export const setAvatar = async ({ activeUser, avatarId }) => {
  return await signTransaction({
    activeUser,
    account: 'atomicassets',
    action: 'transfer',
    data: {
      from: activeUser.accountName,
      to: GAME_CONTRACT,
      asset_ids: [avatarId],
      memo: 'set avatar'
    }
  });
};

// Set equipment
export const setEquipment = async ({ activeUser, equipments }) => {
  return await signTransaction({
    activeUser,
    account: 'atomicassets',
    action: 'transfer',
    data: {
      from: activeUser.accountName,
      to: GAME_CONTRACT,
      asset_ids: equipments,
      memo: 'set equipment'
    }
  });
};


// SWAPS
export const swap = async ({ activeUser, resource, amount2swap }) => {
  return await signTransaction({
    activeUser,
    account: GAME_CONTRACT,
    action: 'swap',
    data: {
      owner: activeUser.accountName,
      resource: resource,
      amount2swap: amount2swap
    }
  });
};

// Token or NFT Staking in games 
export const tokenStake = async ({ activeUser, quantity }) => {
  const formattedQuantity = Number(quantity).toFixed(8);

  return await signTransaction({
    activeUser,
    account: 'eosio.token',
    action: 'transfer',
    data: {
      from: activeUser.accountName,
      to: 'dappgamemine',
      quantity: `${formattedQuantity} WAX`,
      memo: 'stake'
    }
  });
};

// Governance by users/players 

export const createVoting = async ({ activeUser, resName, ratio }) => {
  return await signTransaction({
    activeUser,
    account: 'dappgamemine',
    action: 'createvoting',
    data: {
      player: activeUser.accountName,
      resource_name: resName,
      new_ratio: ratio,
    }
  });
};

// vote
export const gvote = async ({ activeUser, voting_name, voting_option, voting_power }) => {
  return await signTransaction({
    activeUser,
    account: 'dappgamemine',
    action: 'gvote',
    data: {
      player: activeUser.accountName,
      voting_name,
      voting_option,
      voting_power,
    }
  });
};

// Leaderboards system


// Quests system
export const collectQuest = async ({ activeUser, index }) => {
  return await signTransaction({
    activeUser,
    account: 'dappgamemine',
    action: 'cmpltquest',
    data: {
      player: activeUser.accountName,
      quest_index: index,
    }
  });
};

