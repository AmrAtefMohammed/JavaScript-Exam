///<reference types="../@types/jquery" />



$(document).ready(function(){

    const nav = $("nav");
    const closeNav = $(".closeNav");
    const openNav = $(".openNav");
    const navContent = $("nav .content");
    const navContentWidth = navContent.outerWidth();
    const navLinks = $("nav ul");
    const mealsContainer = $(".mealsContainer");

    const searchButton = $("nav #search");
    const categoryButton = $("nav #categories");
    const areaButton = $("nav #area");
    const ingredientsButton = $("nav #ingredients");
    const contactButton = $("nav #contact");

    const searchDiv = $("div.searchContainer");
    const searchNameInput = $("input.searchNameInput");
    const searchFirstNameInput = $("input.searchFirstNameInput");
    const loadingContainer = $(".loadingContainer");
    const loadingInside = $("div.loadingInside");
    const backHome = $("nav img.backHome");
    const formDiv = $(".form");


    let arrOfMeals = [];


    (async function () {
        nav.animate({ left: -navContentWidth }, 150);
        let meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        let resultMeals = await meals.json();
        arrOfMeals = resultMeals.meals;

        loadingContainer.addClass("d-none");
        $("html, body").css("overflow", "auto");

        displayMeals(arrOfMeals);
    })();


    function openNavbar() {
        openNav.addClass("d-none");
        closeNav.removeClass("d-none");
        nav.animate({ left: 0 }, 500);
        navLinks.animate({ top: 0 }, 750);
    }
    function closeNavbar() {
        closeNav.addClass("d-none");
        openNav.removeClass("d-none");
        nav.animate({ left: -navContentWidth }, 500);
        navLinks.animate({ top: "100%" }, 400);
    }

    openNav.on("click", function () {
        openNavbar();  
    })
    closeNav.on("click", function () {
        closeNavbar();      
    })

    

    
    /*              Buttons              */

    backHome.on("click", function () {
        buttonHelper();
        callApiMain();
    })


    searchButton.on("click", function () {
        searchDiv.removeClass("d-none");
        formDiv.addClass("d-none")
        closeNavbar();
        mealsContainer.html("");
    })


    function buttonHelper() {
        mealsContainer.html("");
        closeNavbar();
        searchDiv.addClass("d-none");
        formDiv.addClass("d-none")
    }

    categoryButton.on("click",function () {
        buttonHelper();
        callApiCategory();
    })

    areaButton.on("click", function () {
        buttonHelper();
        callApiArea();
    })

    ingredientsButton.on("click", function () {
        buttonHelper();
        callApiIngredients();
    })

    contactButton.on("click", function () {
        searchDiv.addClass("d-none");
        formDiv.removeClass("d-none")
        closeNavbar();
        mealsContainer.html("");
    })

    /*              APIS              */

    function callApiMain() {
        loadingContainer.removeClass("d-none");
        fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
            .then(function (response) {
                return response.json();
            }).then(function (arr) {
                arrOfMeals = arr.meals;
                loadingContainer.addClass("d-none");
                displayMeals(arrOfMeals);
        })
    }

    function callMealsApi(meal) {
        loadingInside.removeClass("d-none");
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
            .then(function (response) {
                return response.json();
            }).then(function (array) {
                const temp = array?.meals;
                arrOfMeals = temp?.slice(0, 20);
                loadingInside.addClass("d-none");
                displayMeals(arrOfMeals);
        })
    }

    function callApiCategory() {
        loadingInside.removeClass("d-none");
        fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
            .then(function (response) {
                return response.json();
            }).then(function (arr){
                arrOfMeals = arr.categories;
                loadingInside.addClass("d-none");
                displayCategoriesData(arrOfMeals);
                $(".category").on("click", function () {
                    callApiFilterCategory($(this).attr("id"));
                })
        })
    }

    async function callApiFilterCategory(category)
    {
        loadingInside.removeClass("d-none");
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const res = await response.json();
        const temp = res.meals;
        arrOfMeals = temp.slice(0, 20);
        mealsContainer.html("");
        /* console.log(arrOfMeals); */
        loadingInside.addClass("d-none")
        displayMeals(arrOfMeals);
    }

    function callApiArea() {
        loadingInside.removeClass("d-none");
        fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
            .then(function (response) {
                return response.json();
            }).then(function (arr) {
                arrOfMeals = arr.meals;
                /* console.log(arrOfMeals); */
                loadingInside.addClass("d-none")
                displayAreas(arrOfMeals);
                $(".areas").on("click", function () {
                    mealsContainer.html("");
                    const myArea = $(this).attr("id")
                    callApiMealsByArea(myArea);
                })
        })
    }

    function callApiMealsByArea(area) {
        loadingInside.removeClass("d-none");
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
            .then(function (response) {
                return response.json();
            }).then(function (arr) {
                const temp = arr.meals;
                arrOfMeals = temp.slice(0, 20);
                loadingInside.addClass("d-none");
                displayMeals(arrOfMeals);
            })
    }

    function callApiIngredients() {
        loadingInside.removeClass("d-none");
        fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
            .then(function (response) {
                return response.json();
            }).then(function (array) {
                const temp = array.meals;
                arrOfMeals = temp.slice(0, 20);
                loadingInside.addClass("d-none")
                displayIngredients(arrOfMeals);
                $(".ingredient").on("click", function () {
                    callApiMealsByIngredient($(this).attr("id"));
                })
        })
    }

    function callApiMealsByIngredient(ingredient) {
        loadingInside.removeClass("d-none");
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(function (response) {
                return response.json();
            }).then(function (array) {
                const temp = array.meals;
                arrOfMeals = temp.slice(0, 20);
                loadingInside.addClass("d-none")
                displayMeals(arrOfMeals);
        })
    }


    function callApiMealsDetails(id) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(function (response) {
                return response.json();
            }).then(function (arr) {
                arrOfMeals = arr.meals;
                
        })
        
    }



    /*              Display              */

    function displayMeals(arr) {
        let cartoona = '';
        for (let i = 0; i < arr?.length; i++){
            cartoona += 
                `
                    <div class="col-xl-3 col-lg-4 col-md-6 col-12">
                        <div class="imageContainer position-relative cursor-pointer meals">
                            <img src="${arr[i].strMealThumb}" class="w-100" alt="">

                            <div class="imageHover d-flex align-items-center justify-content-center position-absolute w-100 h-100">
                                <h2 class="text-black fw-medium">${arr[i].strMeal}</h2>
                            </div>
                        </div>
                    </div>
                `    
        }
        mealsContainer.html(cartoona);
        $(".meals").on("click", function () {
            displayMealInfo()
        })

    }

    function displayCategoriesData(arr) {
        let cartoona = "";
        for (let index = 0; index < arr.length; index++)
        {
            cartoona += 
                `
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 ">
                        <div class="imageContainer position-relative cursor-pointer category" id="${arr[index].strCategory}">
                            <img src="${arr[index].strCategoryThumb}" class="w-100" alt="">
    
                            <div class="imageHover text-center position-absolute w-100 h-100 px-2 d-flex justify-content-center align-items-center flex-column d-sm-block">
                                <h2 class="text-black fw-medium">${arr[index].strCategory}</h2>
                                <p>${arr[index].strCategoryDescription.slice(null, 60)}</p>
                            </div>
                        </div>
                    </div>
                `
        }
        mealsContainer.html(cartoona);
    };

    function displayAreas(arr) {
        let cartoona = '';
        for (let i = 0; i < arr?.length; i++){
            cartoona += 
                `
                    <div class="col-xl-3 col-lg-4 col-md-6 col-12">
                        <div class="cursor-pointer text-center areas" id="${arr[i]?.strArea}">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <p class="text-center fw-medium fs-2">${arr[i]?.strArea}</p>
                        </div>
                    </div>
                `    
        }
        mealsContainer.html(cartoona);
    }

    function displayIngredients(arr) {
        let cartoona = '';
        for (let i = 0; i < arr?.length; i++){
            cartoona += 
                `
                    <div class="col-xl-3 col-lg-4 col-md-6 col-12">
                        <div class="cursor-pointer text-center ingredient" id="${arr[i]?.strIngredient}">
                            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                            <h2 class="my-2">${arr[i]?.strIngredient}</h2>
                            <p class="text-center fw-medium">${arr[i]?.strDescription.slice(0, 60)}</p>
                        </div>
                    </div>
                `    
        }
        mealsContainer.html(cartoona);
    }


    function displayMealInfo(object) {
        const cartoona = 
                `
                    <div class="col-md-4">
                        <div>
                            <img src="images/58oia61564916529.jpg" class="w-100 rounded-4" alt="">
                            <h2 class="my-3">Kumper</h2>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <h2>Instructions</h2>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate beatae magni sint eos vero nostrum corrupti molestias ducimus quae. Quisquam doloribus ex in odio? Enim totam praesentium blanditiis quos debitis qui, alias atque recusandae, assumenda id in neque itaque iusto perferendis tenetur! Iure vitae, odio consectetur nulla molestiae voluptatibus assumenda! Placeat similique quidem eum modi delectus laudantium necessitatibus esse commodi quae libero autem, aut velit possimus! Quibusdam aperiam nobis voluptatibus.</p>
                        <h3>Area: Turkish</h3>
                        <h3>Category: Side</h3>
                        <h3>Recipes:</h3>
                        <div class="recipesContainer d-flex align-items-center gap-2 flex-wrap my-3">
                            <span>2 large Potatoes</span>
                            <span>2 large Potatoes</span>
                            <span>2 large Potatoes</span>
                            <span>2 large Potatoes</span>
                            <span>2 large Potatoes</span>
                            <span>2 large Potatoes</span>
                            <span>2 large Potatoes</span>
                        </div>
                        <h3>Tags:</h3>
                        <div class="mb-4">
                            <span class="tags bg-primary my-2">Dish</span>
                        </div>


                        <a class="btn btn-success mx-2" href="" target="_blank">Source</a>
                        <a class="btn btn-danger" href="" target="_blank">Youtube</a>
                    </div>
                `
            mealsContainer.html(cartoona);
    }







    searchNameInput.on("keyup", function () {
        if ($(this).val() == '') {
            mealsContainer.html("");
        }
        else {
            callMealsApi($(this).val());
        }
    })

    searchFirstNameInput.on("keyup", function () {
        if ($(this).val() == '') {
            mealsContainer.html("");
        }
        else {
            callMealsApi($(this).val());
        }
    })



    /*              Form              */


    const formInputs = $(".inputContact");
    const btnSubmit = $("button#btnSubmit");

    const nameInput = $("#nameInput");
    const emailInput = $("#emailInput");
    const phoneInput = $("#phoneInput");
    const ageInput = $("#ageInput");
    const passwordInput = $("#passwordInput");
    const repasswordInput = $("#repasswordInput");


    function validation() {
        if (validateName() && validateEmail() && validatePhone()
            && validateAge() && validatePassword() && validateRepassword())
        {
            btnSubmit.attr("disabled", false);
        }
        else {
            btnSubmit.attr("disabled", true);
        }
    }

    function validateName() {
        const nameRegex = /^[(a-z)|(A-Z)]{1}[(a-z)|(A-Z)|\s]{0,}$/;
        if (nameRegex.test(nameInput.val())) {
            nameInput.next().addClass("d-none");
            nameInput.removeClass("is-invalid");
            nameInput.addClass("is-valid");
            return true;
        }
        else {
            nameInput.next().removeClass("d-none");
            nameInput.removeClass('is-valid');
            nameInput.addClass("is-invalid");
            return false;
        }
    }
    function validateEmail() {
        const emailRegex = /^(\w|\d|\-){1,}@gmail\.com$/;
        if (emailRegex.test(emailInput.val())) {
            emailInput.next().addClass("d-none");
            emailInput.removeClass("is-invalid");
            emailInput.addClass("is-valid");
            return true;
        }
        else {
            emailInput.next().removeClass("d-none");
            emailInput.removeClass("is-valid");
            emailInput.addClass("is-invalid");
            return false;
        }
    }
    function validatePhone() {
        const phoneRegex = /^(01)(0|1|2|5)[0-9]{8}$/;
        if (phoneRegex.test(phoneInput.val())) {
            phoneInput.next().addClass("d-none");
            phoneInput.removeClass("is-invalid");
            phoneInput.addClass("is-valid");
            return true;
        }
        else {
            phoneInput.next().removeClass("d-none");
            phoneInput.removeClass("is-valid");
            phoneInput.addClass("is-invalid");
            return false;
        }
    }
    function validateAge() {
        const ageRegex = /^([2-5][0-9]|1[5-9]|6[0-5])$/;
        if (ageRegex.test(ageInput.val())) {
            ageInput.next().addClass("d-none");
            ageInput.removeClass("is-invalid");
            ageInput.addClass("is-valid");
            return true;
        }
        else {
            ageInput.next().removeClass("d-none");
            ageInput.removeClass("is-valid");
            ageInput.addClass("is-invalid");
            return false;
        }
    }
    function validatePassword() {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (passwordRegex.test(passwordInput.val())) {
            passwordInput.next().addClass("d-none");
            passwordInput.removeClass("is-invalid");
            passwordInput.addClass("is-valid");
            return true;
        }
        else {
            passwordInput.next().removeClass("d-none");
            passwordInput.removeClass("is-valid");
            passwordInput.addClass("is-invalid");
            return false;
        }
    }
    function validateRepassword() {
        if (passwordInput.hasClass("is-valid") && passwordInput.val() == repasswordInput.val())
        {
            repasswordInput.removeClass("is-invalid");
            repasswordInput.addClass("is-valid");

            repasswordInput.next().addClass("d-none");
            return true;
        }
        else {
            repasswordInput.removeClass("is-valid");
            repasswordInput.addClass("is-invalid");

            repasswordInput.next().removeClass("d-none");
            return false;
        }
    }
    

    nameInput.on("keyup", function () {
        validateName();
        validation();
    })
    emailInput.on("keyup", function () {
        validateEmail();
        validation();
    })
    phoneInput.on("keyup", function () {
        validatePhone();
        validation();
    })
    ageInput.on("keyup", function () {
        validateAge();
        validation();
    })
    passwordInput.on("keyup", function () {
        validatePassword();
        validation();
    })
    repasswordInput.on("keyup", function () {
        validateRepassword();
        validation();
    })


    btnSubmit.on("click", function () {
        alert("Successfully!!");
    })
})