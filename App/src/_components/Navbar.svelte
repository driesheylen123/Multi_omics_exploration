<script>

    import { toggle_sidebar } from '../stores.js';

</script>

<nav class="navbar navbar-expand-lg justify-content-between navbar-light bg-transparent py-4 px-4">
    <div class="d-flex align-items-center">
        <i class="fas fa-align-left text-dark fs-4 me-3" id="menu-toggle" on:click={() => $toggle_sidebar = !$toggle_sidebar}></i>			
    </div>

    <div class="d-flex align-items-center">
        <a href="#" class="link-text me-3">Docs</a>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="d-flex align-items-center link-text">
            <i class="fab fa-github"></i>
        </a>
    </div>
</nav>

<style>
    .link-text, .link-text:hover, .link-text:focus, .link-text:active {
        text-decoration: none;
        color: #292b2c;
    }
    #menu-toggle {
        cursor: pointer;
    }
</style>