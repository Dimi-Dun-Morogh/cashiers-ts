
class ApiDb {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async createCashier(data) {
    try {
      const response = await fetch(this.baseUrl + '/cashiers', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => res.json());
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }
  async getCashierById(id) {
    try {
      const data = await fetch(this.baseUrl + `/cashiers/:${id}`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllCashiers() {
    try {
      const data = await fetch(this.baseUrl + '/cashiers').then((res) =>
        res.json(),
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }
  async getTargetCashiers1() {
    try {
      const data = await fetch(this.baseUrl + '/cashiers/targetcashiers1').then(
        (res) => res.json(),
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }
  async getTargetCashiers2() {
    try {
      const data = await fetch(this.baseUrl + '/cashiers/targetcashiers2').then(
        (res) => res.json(),
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }
}

class RenderElements {
  constructor(dbContentNode) {
    this.dbContentNode = dbContentNode;
  }
  wipeDbElements() {
    this.dbContentNode.innerHTML = '';
  }
  popCashiers(cashiers) {
    this.wipeDbElements();
    const html = cashiers.reduce((acc, item) => {
      let { id, name, age, sex, yearsOfExperience, worksInShifts } =
        item;
      worksInShifts = Array.isArray(worksInShifts)
        ? JSON.stringify(worksInShifts)
        : '';
      acc += `
      <div class="db-content-item  col-md-3 me-1 my-2">
      <ul class="list-group">
        <li class="list-group-item">id: ${id}</li>
        <li class="list-group-item">name: ${name}</li>
        <li class="list-group-item">age: ${age}</li>
        <li class="list-group-item">sex: ${sex}</li>
        <li class="list-group-item">yearsOfExperience: ${yearsOfExperience}</li>
        <li class="list-group-item">worksInShifts: ${worksInShifts}</li>
      </ul>
    </div>
      `;
      return acc;
    }, '');
    this.dbContentNode.innerHTML = html;
  }
}

const api = new ApiDb('http://localhost:3011/api');

//* events

window.onload = () => {
  const allCashiersBtn = document.querySelector('#all-cashiers');
  const targetCashier1Btn = document.querySelector('#cashiers-1');
  const targetCashier2Btn = document.querySelector('#cashiers-2');
  const form = document.querySelector('#form');
  const dbContentNode = document.querySelector('.db-content');

  const render = new RenderElements(dbContentNode);

  allCashiersBtn.addEventListener('click', async () => {
    const data = await api.getAllCashiers();
    render.popCashiers(data);
  });

  targetCashier1Btn.addEventListener('click', async () => {
    const data = await api.getTargetCashiers1();
    render.popCashiers(data);
  });

  targetCashier2Btn.addEventListener('click', async () => {
    const data = await api.getTargetCashiers2();
    render.popCashiers(data);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('cashiers-name'),
      age: formData.get('cashier-age'),
      sex: formData.get('cashier-sex'),
      yearsOfExperience: formData.get('cashier-exp'),
      worksInShifts: formData.getAll('cashier-shift'),
    };

    const newCashier = await api.createCashier(data)
    render.popCashiers([newCashier]);
  });
};
