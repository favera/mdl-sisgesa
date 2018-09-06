<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Usuarios</h4>
            <div class="two fields">
                <div class="inline fields">
                    <div class="ten wide field">
                        <div class="ui icon input">
                            <input type="text" placeholder="Buscar Usuario...">
                            <i class="close link icon"></i>
                        </div>
                    </div>

                    <button class="ui circular teal icon button">
                        <i class="search icon"></i>
                    </button>

                </div>

                <div class="field">

                    <div class="ui right floated main menu">
                        <a class="icon item">
                            <i class="plus icon" @click="newUser"></i>
                        </a>

                    </div>

                </div>
            </div>

        </div>

        <div class="field">

            <table class="ui teal striped celled table">
                <thead>
                    <tr>
                        <th>
                            Nombre y Apellido
                        </th>
                        <th>Nombre de Usuario</th>
                        <th>Perfil</th>
                        <th>Email</th>
                        <th class="center aligned">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user._id">
                        <td>{{user.name}}</td>
                        <td>{{user.username}}</td>
                        <td>{{user.profile}}</td>
                        <td>{{user.email}}</td>
                        <td class="center aligned">
                            <i class="edit icon" @click="editUser(user._id)"></i>
                            <i class="trash icon" @click="deleteUser(user._id, index)"></i>
                        </td>
                    </tr>

                </tbody>

                <tfoot>
                    <tr>
                        <!-- <th colspan="7">
                    <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
                    </app-pagination>
                    </th> -->
                    </tr>
                </tfoot>
            </table>

        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      users: []
    };
  },
  methods: {
    newUser() {
      this.$router.push({ name: "includeUser" });
    },
    editUser(userId) {
      this.$router.push({
        name: "editUser",
        params: {
          id: userId,
          edit: true
        }
      });
    },
    getUsers() {
      this.$http.get(`/users/users-list`).then(response => {
        this.users = response.data;
      });
    },
    deleteUser(userId, index) {
      this.$confirm(
        "Este registro sera eliminado permanentemente. Continuar?",
        "Alerta",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.delete(`/users/delete/${userId}`).then(response => {
            if (response.status === 200) {
              this.users.splice(index, 1);
              this.$message({
                type: "success",
                message: "Registro Eliminado exitosamente"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    }
  },
  created() {
    this.getUsers();
  }
};
</script>
<style>
</style>


