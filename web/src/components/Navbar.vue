<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <router-link class="navbar-brand" to="/">
              {{ info.title }}
            </router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse" v-if="search">
            <form class="navbar-form navbar-right">
                <div class="form-group">
                    <input type="text" placeholder="Search Player..." class="form-control" id="search">
                </div>
            </form>
        </div><!--/.navbar-collapse -->
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: ['search', 'info'],
};

</script>
