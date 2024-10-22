<template>
  <div>
    <div class="navbar">
      <p class="text-2xl font-bold">BEEZON CASH</p>
    </div>
    <div class="flex flex-col bg-zinc-100">
      <div class="flex flex-row my-3 pr-3">
        <div class="w-32"></div>
        <div class="flex flex-row justify-between grow">
          <span class="text-2xl font-bold">Users</span>
          <div class="flex flex-row gap-5">
            <label
              class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
            >
              <input type="text" class="grow" placeholder="Search" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
            <button class="btn btn-sm btn-outline">Add user</button>
          </div>
        </div>
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col w-32">
          <ul class="menu rounded-box py-0">
            <li><button>Users</button></li>
            <li><button>Messages</button></li>
            <li><button>Integration</button></li>
          </ul>
        </div>
        <div class="overflow-x-auto grow">
          <table class="table table-sm">
            <thead>
              <tr class="bg-base-200">
                <th>ID</th>
                <th>NAME</th>
                <th>PHONE NUMBER</th>
                <th>TG USERNAME</th>
                <th>REFERRAL CODE</th>
                <th>INVITED BY</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>First Last</td>
                <td>+31612345678</td>
                <td>rogue</td>
                <td>AKDJAK546510351</td>
                <td>-</td>
                <td>148</td>
              </tr>
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>First Last</td>
                <td>+31612345678</td>
                <td>rogue</td>
                <td>AKDJAK546510351</td>
                <td>-</td>
                <td>148</td>
              </tr>
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>First Last</td>
                <td>+31612345678</td>
                <td>rogue</td>
                <td>AKDJAK546510351</td>
                <td>-</td>
                <td>148</td>
              </tr>
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>First Last</td>
                <td>+31612345678</td>
                <td>rogue</td>
                <td>AKDJAK546510351</td>
                <td>-</td>
                <td>148</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
