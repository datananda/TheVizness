$(".comments-btn").on("click", function () {
    const clickedId = $(this).closest(".card-footer").data("id");
    $(`.modal[data-id='${clickedId}']`).addClass("active");
});

$(".delete-comment-btn").on("click", function () {
    const articleId = $(this).closest(".modal").data("id");
    const commentId = $(this).data("id");
    const commentToDelete = $(this).closest(".tile");
    const dividerToDelete = commentToDelete.prev();
    $.ajax({
        type: "DELETE",
        url: `/articles/${articleId}/comments/${commentId}`,
    }).then((result) => {
        if (result._id) {
            commentToDelete.remove();
            dividerToDelete.remove();
        }
    });
});

$(".submit-comment-btn").on("click", function () {
    const articleId = $(this).closest(".modal").data("id");
    const comment = $(this).prev().val().trim();
    $(this).prev().val("");
    $.post({
        url: `/articles/${articleId}`,
        data: {
            comment,
        },
    }).then((result) => {
        if (result.comments[0]) {
            const newComment = result.comments[0];
            const commentDate = moment(newComment.date).format("MMM D, YYYY [at] h:mm a");
            const newDivider = $("<div class='divider dynamic'>");
            const newTile = $("<div class='tile my-2 dynamic'>").append($("<div class='tile-icon'>").append($("<i class='icon icon-message'>")));
            const tileContent = $("<div class='tile-content'>");
            tileContent.append($("<p class='my-1 tile-title text-gray'>").text(commentDate));
            tileContent.append($("<p class='mb-1 title-subtitle'>").text(newComment.comment));
            newTile.append(tileContent);
            const tileAction = $("<div class='tile-action'>").append($(`<button class='btn btn-action delete-comment-btn' data-id='${comment._id}'>`).append($("<i class='icon icon-delete'>")));
            newTile.append(tileAction);
            $(".modal.active").find(".modal-body").prepend(newDivider, newTile);
        }
    });
});

// $(() => {
//     $(".card-title").dotdotdot({
//         watch: true,
//     });
//     $(".card-body").dotdotdot({
//         watch: true,
//     });
// });
